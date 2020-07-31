
// Minor wrapper over Handlebars

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import MarkdownRenderer from 'markdown-it';
export {Handlebars as engine};

let templateDir = path.join(path.resolve(), 'templates', 'basic');
let templates = Object.create(null);

export function setTemplateDir(newDir) {
	templates = Object.create(null);
	templateDir = newDir;
}

export function getTemplate(templateName) {
	if (!templates[templateName]) {
		templates[templateName] = Handlebars.compile(fs.readFileSync(path.join(templateDir, `${templateName  }.hbs`)).toString());
	}
	return templates[templateName];
}

let _AKAs = {};

export function setAKAs(akas) {
	// 	console.log('Template thing updating AKAs');
	_AKAs = akas;
}

/// TODO: Allow setting markdown-it options (enable/disable tables, autolinks, abbrevs, etc)
let markdownRenderer;
function markdown(str) {
	if (!markdownRenderer) {
		markdownRenderer = MarkdownRenderer(/* markdown-it options */);
	}
	return markdownRenderer.render(str);
}

// Helper to replace AKAs in markdown links.
function replaceAKAs(str) {
	str = str.trim();
	for (const i in _AKAs) {

		// [...](#a) → [...](#b)
		str = str.replace(`(#${i})`, `(#${  _AKAs[i]  })`);

		// `a` → [`a`](#b)
		str = str.replace(`\`${i}\``, `[\`${i}\`](#${  _AKAs[i]  })`);

	}
	return str;
}

Handlebars.registerHelper('markdown', function markdownHelper(str) {
	if (!str) return '';
	if (str instanceof Array) {
		str = str.join('\n').trim();
		// 		str = str.join(' ');
	}
	return markdown(replaceAKAs(str))
		.trim()
		.replace('<p>', '')
		.replace('</p>', '');
});

Handlebars.registerHelper('rawmarkdown', function rawmarkdownHelper(str) {
	if (!str) { return ''; }
	if (str instanceof Array) {
		str = str.join('\n');
	}
	return markdown(replaceAKAs(str));
});


// Automatically link to AKAs, mostly used on method/function/param/option data types.
Handlebars.registerHelper('type', function typeHelper(str) {
	if (!str) { return ''; }
	if (str in _AKAs) {
		const id = _AKAs[str];
		return `<a href='#${  id  }'>${  str  }</a>`;
	} else {
		// Should be a built-in type
		return str;
	}
});


// JSON stringify the stuff.
Handlebars.registerHelper('json', function jsonHelper(obj) {
	return JSON.stringify(obj, undefined, 1);
});


