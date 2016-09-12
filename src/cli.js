#!/usr/bin/env js


/*
🍂namespace Command-line usage

Leafdoc includes a small command-line utility, useful when running from a console or a shell script, accepting some of the Leafdoc options. The syntax is:

`leafdoc [options] [files]`

🍂example

`leafdoc -t templates/pretty -c '@' --verbose -o documentation.html src/*.js`

*/



var minimist = require('minimist');
var sander = require('sander');
var Leafdoc = require('./leafdoc');
var path = require('path');

var argv = minimist( process.argv.slice( 2 ), {
	alias: {
		// 🍂option template: String='templates/basic'; Akin to [Leafdoc.templateDir](#leafdoc.templatedir)
		// 🍂option t; Alias of `template`
		t: 'template',
		// 🍂option character: String='🍂'; Akin to [Leafdoc.leadingCharacter](#leafdoc.leadingcharacter)
		// 🍂option c; Alias of `character`
		c: 'character',
		// 🍂option verbose: Boolean=false; Akin to [Leafdoc.verbose](#leafdoc.verbose)
		// 🍂option v; Alias of `verbose`
		v: 'verbose',
		// 🍂option output: String=undefined; File to write the documentation to. If left empty, documentation will be outputted to `stdout` instead.
		// 🍂option o; Alias of `output`
		o: 'output',
		// 🍂option json: Boolean=false; Write the internal JSON representation of the documentation instead of a templated HTML file.
		// 🍂option o; Alias of `output`
		j: 'json'
	},
	boolean: ['v', 'verbose', 'j', 'json'],
	string: ['t', 'template', 'c', 'character'],
	default: { verbose: false, template: 'templates/basic', character: '🍂' }
});

var doc = new Leafdoc({
	verbose: argv.verbose,
	templateDir: argv.template,
	character: argv.character
});

argv._.forEach( function(filepath) {
	try {
		var stats = sander.statSync(filepath);

		if (stats.isFile()) {
			doc.addFile(filepath, path.extname(filepath) !== '.leafdoc');
		}

		if (stats.isDirectory()) {
			doc.addDir(filepath);
		}
	} catch(e) {
		throw e;
	}
} );

var out;
if (argv.json) {
	out = doc.outputJSON();
} else {
	out = doc.outputStr();
}

if (argv.output) {
	sander.writeFileSync(argv.output, out);
} else {
	console.log(out);
}


