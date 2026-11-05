import {spawn} from 'node:child_process';
import {readdir} from 'node:fs/promises';
const files=(await readdir('tests')).filter(name=>name.endsWith('.test.mjs')).sort();
// Explicit filenames work on Windows Node 22 as well as shell-globbing platforms.
const child=spawn(process.execPath,['--experimental-strip-types','--test',...files.map(name=>'tests/'+name)],{stdio:'inherit',windowsHide:true});
const timer=setTimeout(()=>{
  console.error('Test suite exceeded its 120-second limit.');
  if(process.platform==='win32')spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true});
  else child.kill('SIGTERM');
},120000);
child.once('error',error=>{clearTimeout(timer);console.error(error);process.exitCode=1;});
child.once('close',code=>{clearTimeout(timer);process.exitCode=code??1;});
