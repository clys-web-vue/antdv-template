/* eslint-disable no-unused-vars */
const fs = require('fs');
const {spawn} = require('child_process');
const isWin = process.platform === 'win32';

const spawnOptions = {};
if (isWin) {
  spawnOptions.shell = true;
}

const runCmd = (cmd, param, options = {}) => {
  return new Promise((resolve, reject) => {
    let cmdProcess = spawn(cmd, param, {...spawnOptions, ...options});
    cmdProcess.stdout.on('data', function (data) {
      process.stdout.write(data)
    });
    cmdProcess.stderr.on('data', function (data) {
      process.stderr.write(data)
    });

    cmdProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  })
};