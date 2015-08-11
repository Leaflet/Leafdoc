
// Minor wrapper over Handlebars

var sander = require('sander');
var Handlebars = require('handlebars');

module.exports = function(templateName) {
	
	return Handlebars.compile(sander.readFileSync('templates/' + templateName + '.hbs').toString());
	
};




var marked = require('marked');


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



Handlebars.registerHelper('markdown', function(str) {
	return marked(str)
		.replace('<p>','')
		.replace('</p>','')
		.replace('\n','<br>\n');
});

Handlebars.registerHelper('rawmarkdown', function(str) {
	return marked(str);
});


