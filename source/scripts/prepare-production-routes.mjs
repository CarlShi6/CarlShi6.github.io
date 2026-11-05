import {existsSync,readFileSync,readdirSync,writeFileSync,unlinkSync} from 'node:fs';
import {resolve,join,relative,sep} from 'node:path';
import {productionRoutes,productionExtension,generatedMarker} from './production-policy.mjs';

export function sourceRoutes(root=process.cwd()) {
  const app=resolve(root,'app'),routes=[];
  const visit=dir=>{for(const entry of readdirSync(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())visit(path);
    else if(entry.name==='page.tsx')routes.push('/'+relative(app,dir).split(sep).filter(Boolean).join('/'));
  }};visit(app);return routes.sort();
}

export function prepareProductionRoutes(root=process.cwd()) {
  const app=resolve(root,'app'),all=sourceRoutes(root),expected=new Map();
  for(const route of productionRoutes){
    if(!all.includes(route))throw new Error(`Release route has no source: ${route}`);
    const dir=resolve(app,'.'+route);
    if(dir!==app&&!dir.startsWith(app+sep))throw new Error('Unsafe release route');
    expected.set(join(dir,`page.${productionExtension}`),'page');
  }
  expected.set(join(app,`layout.${productionExtension}`),'layout');
  // Remove only obsolete files bearing our exact generated marker, inside app/.
  const visit=dir=>{for(const entry of readdirSync(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())visit(path);
    else if(entry.name.endsWith('.'+productionExtension)&&!expected.has(path)){
      if(!readFileSync(path,'utf8').startsWith(generatedMarker))throw new Error(`Unowned release entry: ${path}`);
      unlinkSync(path);
    }
  }};visit(app);
  for(const [file,source] of expected){
    const content=generatedMarker+`export { default } from './${source}';\nexport * from './${source}';\n`;
    if(existsSync(file)){
      const previous=readFileSync(file,'utf8');
      if(!previous.startsWith(generatedMarker))throw new Error(`Refusing to overwrite ${file}`);
      if(previous===content)continue;
    }
    writeFileSync(file,content);
  }
  return {included:productionRoutes,excluded:all.filter(route=>!productionRoutes.includes(route))};
}
