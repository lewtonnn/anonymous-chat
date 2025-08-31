const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream('project-files.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`Project packaged! ${archive.pointer()} total bytes`);
  console.log('Download: project-files.zip');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add all project files except node_modules and dist
archive.glob('**/*', {
  cwd: path.join(__dirname, '..'),
  ignore: [
    'node_modules/**',
    'dist/**',
    '.git/**',
    'project-files.zip',
    '*.log'
  ]
});

archive.finalize();