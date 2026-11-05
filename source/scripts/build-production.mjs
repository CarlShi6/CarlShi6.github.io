import {spawn} from 'node:child_process';
import {readdir,readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {join,relative,dirname} from 'node:path';
import {prepareProductionRoutes} from './prepare-production-routes.mjs';
import {dynamicAssetPrefixes,dynamicAssets,requiredAssets,productionRoutes} from './production-policy.mjs';

const routes=prepareProductionRoutes();
const child=spawn(process.execPath,['node_modules/vinext/dist/cli.js','build'],{
  env:{...process.env,PORTFOLIO_RELEASE:'1'},stdio:'inherit',windowsHide:true,
});
const code=await new Promise((done,fail)=>{child.once('close',done);child.once('error',fail);});
if(code!==0){process.exitCode=code??1;}else{
  const walk=async dir=>{const found=[];for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);found.push(...entry.isDirectory()?await walk(path):[path]);
  }return found;};
  const client='dist/client',files=await walk(client);
  const emitted=(await Promise.all(files.filter(p=>/\.(html|rsc|js|css|json)$/.test(p)).map(p=>readFile(p,'utf8')))).join('\n');
  const includedAssets=[],excludedAssets=[];
  for(const source of await walk('public')){
    const url='/'+relative('public',source).replaceAll('\\','/');
    if(requiredAssets.includes(url)||dynamicAssets.includes(url)||dynamicAssetPrefixes.some(prefix=>url.startsWith(prefix))||emitted.includes(url)){
      const target=join(client,url);await mkdir(dirname(target),{recursive:true});await copyFile(source,target);includedAssets.push(url);
    }else excludedAssets.push(url);
  }
  const htmlRoutes=files.filter(p=>p.endsWith('index.html')).map(p=>'/'+relative(client,p).replaceAll('\\','/').replace(/(?:\/)?index\.html$/,'')).sort();
  if(JSON.stringify(htmlRoutes)!==JSON.stringify([...productionRoutes].sort()))throw new Error(`Unexpected production HTML routes: ${JSON.stringify(htmlRoutes)}`);
  const manifest=JSON.parse(await readFile('dist/server/vinext-prerender.json','utf8'));
  const text=JSON.stringify(manifest);
  for(const excluded of routes.excluded){if(text.includes(`"${excluded}"`)||text.includes(`"${excluded}/"`))throw new Error(`Experiment in prerender manifest: ${excluded}`);}
  await writeFile('dist/production-audit.json',JSON.stringify({...routes,htmlRoutes,includedAssets,excludedAssets},null,2));
  console.log(`Release verified: ${htmlRoutes.length} routes; ${routes.excluded.length} experiment routes excluded before bundling; ${includedAssets.length} public assets retained, ${excludedAssets.length} unreferenced assets omitted.`);
}
