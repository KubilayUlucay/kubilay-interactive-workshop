import fs from 'node:fs/promises';
import {build} from '../.sites-checkout/node_modules/vite/dist/node/index.js';
import react from '../.sites-checkout/node_modules/@vitejs/plugin-react/dist/index.js';
const root='/workspace/scratch/1677153ed499/review-runtime';
const html=(await fs.readFile('/workspace/scratch/1677153ed499/.sites-checkout/index.html','utf8')).replace('/src/main.jsx','/qa-entry.jsx');
await fs.writeFile(root+'/index.html',html);
await build({root,configFile:false,publicDir:false,plugins:[react()],build:{outDir:root+'/qa-build',emptyOutDir:true}});
