/* See this repository for notes on how it works, specifically main.js: https://github.com/jonkemp/node-qunit-phantomjs */

'use strict';

var assert = require('assert'),
	out = process.stdout.write.bind(process.stdout),
	qunit = function (filepath, runner) {
		var path = require('path'),
			childProcess = require('child_process'),
			phantomjs = require('phantomjs'),
			binPath = phantomjs.path,
			args = Array.prototype.slice.call(arguments);

		if (!runner) {
			runner = '../runner.js';
		}

		var childArgs = [ path.join(__dirname, runner) ];

		if (filepath) {
			childArgs.push( filepath );
		}

		// Optional timeout value
		if ( args[2] ) {
			childArgs.push( args[2] );
		}

		// Optional phantomjs options value
		if ( args[3] ) {
			childArgs.unshift( args[3] );
		}

		childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
			if (stdout) {
				stdout = stdout.trim(); // Trim trailing cr-lf
				console.log(stdout);
			}

			if (stderr) {
				console.log(stderr);
			}

			/*if (err) {
				console.log(err);
			}*/
		});
	};

describe('qunit-phantomjs-runner runner-list.js', function () {
	this.timeout(5000);

	it('tests should pass', function (cb) {

		qunit('test/fixtures/huffman.html', '../runner-list.js');

		process.stdout.write = function (str) {
			out(str);

			assert.ok(/10 passed. 0 failed./.test(str));
			process.stdout.write = out;
			cb();
		};
	});
});