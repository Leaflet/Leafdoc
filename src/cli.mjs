#!/usr/bin/env -S node --experimental-modules


/*
🍂namespace Command-line usage

Leafdoc includes a small command-line utility, useful when running from a console or a shell script, accepting some of the Leafdoc options. The syntax is:

`leafdoc [options] [files]`

🍂example

`leafdoc -t templates/pretty -c '@' --verbose -o documentation.html src`

*/


import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import Leafdoc from './leafdoc.mjs';

const argv = minimist(process.argv.slice(2), {
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
		j: 'json',
		// 🍂option empty: Boolean=false; Akin to [Leafdoc.showInheritancesWhenEmpty](#leafdoc.showinheritanceswhenempty)
		// 🍂option e; Alias of `empty`
		e: 'empty'
	},
	boolean: ['v', 'verbose', 'j', 'json'],
	string: ['t', 'template', 'c', 'character'],
	default: {verbose: false, template: 'templates/basic', character: '🍂'}
});

const doc = new Leafdoc({
	verbose: argv.verbose,
	templateDir: argv.template,
	leadingCharacter: argv.character,
	showInheritancesWhenEmpty: argv.empty
});

argv._.forEach((filepath) => {
	try {
		const stats = fs.lstatSync(filepath);

		if (stats.isFile()) {
			doc.addFile(filepath, path.extname(filepath) !== '.leafdoc');
		}

		if (stats.isDirectory()) {
			doc.addDir(filepath);
		}
	} catch (e) {
		throw e;
	}
});

let out;
if (argv.json) {
	out = doc.outputJSON();
} else {
	out = doc.outputStr();
}

if (argv.output) {
	fs.writeFileSync(argv.output, out);
} else {
	console.log(out);
}


