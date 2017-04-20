'use strict';

const spawn = require('child_process').spawn;

function run () {
  spawn('node', ['proxy/app.js'], { stdio: 'inherit' });
}

module.exports.run = run;
