import {mkdirSync,writeFileSync} from 'node:fs';
import {relative,resolve} from 'node:path';

// Evidence stays outside dist/client. It records real bundled modules, not filenames guessed from chunk hashes.
/** @returns {import('vite').Plugin} */
export function releaseModuleAudit(){return{
  name:'portfolio-release-module-audit',apply:'build',
  writeBundle(_options,bundle){
    const modules=new Set();
    for(const item of Object.values(bundle))if(item.type==='chunk')for(const id of Object.keys(item.modules)){
      if(id.includes('/node_modules/')||id.includes('\\node_modules\\')||id.startsWith('\0'))continue;
      modules.add(relative(process.cwd(),id).replaceAll('\\','/'));
    }
    const env=this.environment.name.replace(/[^a-z0-9_-]/gi,'_');
    mkdirSync(resolve('dist/release-modules'),{recursive:true});
    writeFileSync(resolve('dist/release-modules',env+'.json'),JSON.stringify([...modules].sort(),null,2));
  },
};}
