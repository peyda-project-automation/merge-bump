const childProcess = require('child_process');
const util = require('util');
const { rejects } = require('assert');

module.exports.debug = function debug(...args) {
  process.stderr.write(`::debug::${util.format(...args)}\n`);
}

module.exports.log = function log(...args) {
  process.stderr.write(`${util.format(...args)}\n`);
}

module.exports.exec = function exec(command, ...args) {
  return new Promise((resolve, reject) => {
    module.exports.log(`>`, command, ...args);
    const child = childProcess.spawn(command, args, { stdio: 'pipe' });

    const chunks = [];
    child.stdout.on('data', c => chunks.push(c));

    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('close', code => {
      if (code) {
        reject(new Error(`${command} exited with status ${code}`));
      } else {
        resolve(Buffer.concat(chunks).toString('utf8').trim());
      }
    });
  });
}
