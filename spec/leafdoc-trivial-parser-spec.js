/*eslint-env node,jasmine */

const trivialParser = require('../dist/split/trivial.js');


describe('Trivial parser', () => {
	it('just passes the string around, wrapped in an array', () => {

		expect(trivialParser('foobar')).toEqual(['foobar']);

		const text = `
var path$1 = require('path');
var Handlebars = require('handlebars');

var templateDir = 'basic';

// marked.setOptions({
// 	highlight: function (code) {
// 		return require('highlight').highlight(code).value;
// 	}
// });

var _AKAs = {};

/* function setAKAs(akas) {

// 	console.log('Template thing updating AKAs');
	_AKAs = akas;
} */
`;

		expect(trivialParser(text)).toEqual([text]);
	});

});
