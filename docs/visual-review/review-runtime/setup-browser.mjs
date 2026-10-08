import fs from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const bin=path.join(root,'node_modules/@sparticuz/chromium/bin');
const runtime=path.join(root,'chromium-runtime');
await fs.mkdir(runtime,{recursive:true});
await fs.writeFile(path.join(runtime,'chromium'),brotliDecompressSync(await fs.readFile(path.join(bin,'chromium.br'))),{mode:0o755});
for(const name of ['fonts','swiftshader','al2023']){
  const dest=name==='swiftshader'?runtime:path.join(runtime,name);
  await fs.mkdir(dest,{recursive:true});
  const archive=path.join(runtime,name+'.tar');
  await fs.writeFile(archive,brotliDecompressSync(await fs.readFile(path.join(bin,name+'.tar.br'))));
  execFileSync('tar',['--no-same-owner','-xf',archive,'-C',dest]);
  await fs.unlink(archive);
}
console.log(path.join(runtime,'chromium'));
