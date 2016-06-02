
// Minor wrapper over Handlebars

var sander = require('sander');
var path = require('path');
var Handlebars = require('handlebars');

var templateDir = __dirname + '/../templates/basic';
var templates = Object.create(null)

exports.setTemplateDir = function(newDir) {
	templateDir = newDir;
};

exports.getTemplate = function(templateName) {
	if (!templates[templateName]) {
		templates[templateName] = Handlebars.compile(sander.readFileSync(templateDir, templateName + '.hbs').toString());
	}
	return templates[templateName];
};


var _AKAs = {};

exports.setAKAs = function(akas){

// 	console.log('Template thing updating AKAs');
	_AKAs = akas;
};

exports.engine = Handlebars;




var marked = require('marked');


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



Handlebars.registerHelper('markdown', function(str) {
	if (!str) return;
	if (str instanceof Array) {
		str = str.join('\n').trim();
// 		str = str.join(' ');
	}
	return marked(replaceAKAs(str))
		.trim()
		.replace('<p>','')
		.replace('</p>','');
});

Handlebars.registerHelper('rawmarkdown', function(str) {
	if (!str) { return; }
	if (str instanceof Array) {
		str = str.join('\n');
	}
	return marked(replaceAKAs(str));
});


// Automatically link to AKAs, mostly used on method/function/param/option data types.
Handlebars.registerHelper('type', function(str) {
	if (!str) { return; }
	if ( str in _AKAs ) {
		var id = _AKAs[str];
		return "<a href='#" + id + "'>" + str + "</a>"
	} else {
		// Should be a built-in type
		return str;
	}
});





