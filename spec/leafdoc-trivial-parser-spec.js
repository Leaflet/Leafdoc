import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import trivialParser from '../src/parsers/trivial.js';


describe('Trivial parser', () => {
	it('just passes the string around, wrapped in an array', () => {

		assert.deepEqual(trivialParser('foobar'), ['foobar']);

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

		assert.deepEqual(trivialParser(text), [text]);
	});

});
