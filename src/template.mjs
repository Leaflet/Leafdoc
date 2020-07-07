
// Minor wrapper over Handlebars

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { Parser as CommonMarkParser, HtmlRenderer as CommonMarkHtmlRenderer } from 'commonmark/dist/commonmark.js';
export {Handlebars as engine};

let templateDir = __dirname + '/../templates/basic';
let templates = Object.create(null);

export function setTemplateDir(newDir) {
	templates = Object.create(null);
	templateDir = newDir;
}

export function getTemplate(templateName) {
	if (!templates[templateName]) {
		templates[templateName] = Handlebars.compile(fs.readFileSync(path.join(templateDir, templateName + '.hbs')).toString());
	}
	return templates[templateName];
}


var _AKAs = {};

export function setAKAs(akas) {

// 	console.log('Template thing updating AKAs');
	_AKAs = akas;
}

const markdownParser = new CommonMarkParser();
const markdownRenderer = new CommonMarkHtmlRenderer();
function markdown(str) {
	return markdownRenderer.render(markdownParser.parse(str));
}

// export Handlebars as engine;


/// TODO: Catch all code blocks and check if the contents is a known class, namespace or AKA

// marked.setOptions({
// 	highlight: function (code) {
// 		return require('highlight').highlight(code).value;
// 	}
// });




/// TODO: Make the big markdown functions also automatically link to stuff.

// Helper to replace AKAs in markdown links.
function replaceAKAs(str) {
	str = str.trim();
	for (var i in _AKAs) {

		// [...](#a) → [...](#b)
		str = str.replace('(#' + i + ')', '(#' + _AKAs[i] + ')');

		// `a` → [`a`](#b)
		str = str.replace('`' + i + '`', '[`' + i + '`](#' + _AKAs[i] + ')');

	}
	return str;
}



Handlebars.registerHelper('markdown', function (str) {
	if (!str) return;
	if (str instanceof Array) {
		str = str.join('\n').trim();
		// 		str = str.join(' ');
	}
	return markdown(replaceAKAs(str))
		.trim()
		.replace('<p>', '')
		.replace('</p>', '');
});

Handlebars.registerHelper('rawmarkdown', function (str) {
	if (!str) { return; }
	if (str instanceof Array) {
		str = str.join('\n');
	}
	return markdown(replaceAKAs(str));
});


// Automatically link to AKAs, mostly used on method/function/param/option data types.
Handlebars.registerHelper('type', function (str) {
	if (!str) { return; }
	if (str in _AKAs) {
		var id = _AKAs[str];
		return '<a href=\'#' + id + '\'>' + str + '</a>';
	} else {
		// Should be a built-in type
		return str;
	}
});


// JSON stringify the stuff.
Handlebars.registerHelper('json', function (obj) {
	console.log(obj);
	return JSON.stringify(obj, undefined, 1);
});





