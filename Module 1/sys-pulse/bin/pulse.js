#!/usr/bin/env node
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

const gb = (n) => (n / 1024 ** 3).toFixed(1) + ' GB';
const CODE = new Set(['.js', '.jsx', '.ts', '.py', '.c', '.cpp', '.java', '.html', '.css']);

// Look through a folder, then call itself on every folder inside it
function scan(dir, stats) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name.startsWith('.')) { stats.hidden++; continue; }
      if (e.name === 'node_modules') continue;
      stats.folders++;
      scan(path.join(dir, e.name), stats);
    } else if (e.isFile()) {
      stats.files++;
      if (CODE.has(path.extname(e.name))) stats.code++;
    }
  }
}

const stats = { files: 0, code: 0, folders: 0, hidden: 0 };
scan(process.cwd(), stats);

console.log('folder:', process.cwd());
console.log('folders:', stats.folders);
console.log('files:', stats.files);
console.log('code files:', stats.code);
console.log('hidden folders:', stats.hidden);
console.log('RAM free:', gb(os.freemem()), 'of', gb(os.totalmem()));
console.log('CPU cores:', os.cpus().length);
console.log('hostname:', os.hostname());
console.log('platform:', os.platform());
console.log('uptime:', (os.uptime() / 3600).toFixed(1), 'hours');