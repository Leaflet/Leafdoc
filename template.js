
// Minor wrapper over Handlebars

var sander = require('sander');
var Handlebars = require('handlebars');

module.exports = function(templateName) {
	
	return Handlebars.compile(sander.readFileSync('templates/' + templateName + '.hbs').toString());
	
};




var marked = require('marked');


/// TODO: Catch all code blocks and check if the contents is a known class, namespace or AKA

// marked.setOptions({
// 	highlight: function (code) {
// 		return require('highlight').highlight(code).value;
// 	}
// });





/// TODO: Research highlighting as per `marked`'s examples:

// var markdownString = '```js\n console.log("hello"); \n```';

// // Async highlighting with pygmentize-bundled
// marked.setOptions({
//   highlight: function (code, lang, callback) {
//     require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
//       callback(err, result.toString());
//     });
//   }
// });
// 
// // Using async version of marked
// marked(markdownString, function (err, content) {
//   if (err) throw err;
//   console.log(content);
// });
// 
// // Synchronous highlighting with highlight.js
// marked.setOptions({
//   highlight: function (code) {
//     return require('highlight.js').highlightAuto(code).value;
//   }
// });
// 
// console.log(marked(markdownString));



/// TODO: Create another helper for data types, with access to a list of already defined types.
/// This should automatically create a link to the appropiate section. Use AKAs to do so.

/// TODO: Make the big markdown functions also automatically link to stuff.


Handlebars.registerHelper('markdown', function(str) {
	if (!str) return;
	if (str instanceof Array) {
		str = str.join('\n');
	}
	return marked(str.trim())
		.trim()
		.replace('<p>','')
		.replace('</p>','')
		.replace('\n','<br>\n');
});

Handlebars.registerHelper('rawmarkdown', function(str) {
	if (!str) return;
	if (str instanceof Array) {
		str = str.join('\n');
	}
	return marked(str.trim());
});


