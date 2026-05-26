#!/usr/bin/env node


/*
🍂namespace Command-line usage

Leafdoc includes a small command-line utility, useful when running from a console or a shell script, accepting some of the Leafdoc options. The syntax is:

`leafdoc [options] [files]`

🍂example

`leafdoc -t templates/pretty -c '@' --verbose -o documentation.html src`

*/


import fs from 'fs';
import path from 'path';
import {parseArgs} from 'util';
import Leafdoc from './leafdoc.js';

const {values: argv, positionals} = parseArgs({
	allowPositionals: true,
	options: {
		// 🍂option template: String='templates/basic'; Akin to [Leafdoc.templateDir](#leafdoc.templatedir)
		// 🍂option t; Alias of `template`
		template: {type: 'string',  short: 't', default: 'templates/basic'},
		// 🍂option character: String='🍂'; Akin to [Leafdoc.leadingCharacter](#leafdoc.leadingcharacter)
		// 🍂option c; Alias of `character`
		character: {type: 'string',  short: 'c', default: '🍂'},
		// 🍂option verbose: Boolean=false; Akin to [Leafdoc.verbose](#leafdoc.verbose)
		// 🍂option v; Alias of `verbose`
		verbose: {type: 'boolean', short: 'v', default: false},
		// 🍂option output: String=undefined; File to write the documentation to. If left empty, documentation will be outputted to `stdout` instead.
		// 🍂option o; Alias of `output`
		output: {type: 'string',  short: 'o'},
		// 🍂option json: Boolean=false; Write the internal JSON representation of the documentation instead of a templated HTML file.
		// 🍂option j; Alias of `json`
		json: {type: 'boolean', short: 'j', default: false},
		// 🍂option empty: Boolean=false; Akin to [Leafdoc.showInheritancesWhenEmpty](#leafdoc.showinheritanceswhenempty)
		// 🍂option e; Alias of `empty`
		empty: {type: 'boolean', short: 'e', default: false},
		// 🍂option extensions: String='.js,.leafdoc'; Defines the extensions of the files to process. Optional.
		// 🍂option x; Alias of `extensions`
		extensions: {type: 'string',  short: 'x'}
	}
});

const doc = new Leafdoc({
	verbose: argv.verbose,
	templateDir: argv.template,
	leadingCharacter: argv.character,
	showInheritancesWhenEmpty: argv.empty
});

for (const filepath of positionals) {
	const stats = fs.lstatSync(filepath);

	if (stats.isFile()) {
		doc.addFile(filepath, path.extname(filepath) !== '.leafdoc');
	}

	if (stats.isDirectory()) {
		if (argv.extensions) {
			doc.addDir(filepath, argv.extensions.split(','));
		} else {
			doc.addDir(filepath);
		}
	}
}

const out = argv.json ? doc.outputJSON() : doc.outputStr();

if (argv.output) {
	fs.writeFileSync(argv.output, out);
} else {
	console.log(out);
}
