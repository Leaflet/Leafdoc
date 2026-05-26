import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import cLikeParser from '../src/parsers/multilang.js';


describe('C-like parser', () => {
	describe('when there are no comments', () => {

		it('returns an empty array', () => {

			assert.deepEqual(cLikeParser(''), []);
			assert.deepEqual(cLikeParser('foobar'), []);
			assert.deepEqual(cLikeParser('1234'), []);

			const text = `
var path$1 = require('path');
var Handlebars = require('handlebars');
var templateDir = 'basic';
`;

			assert.deepEqual(cLikeParser(text), []);
		});

	});

	describe('when there are single-line comments', () => {

		it('returns one item of one line', () => {
			assert.deepEqual(cLikeParser('//foobar'), ['foobar']);
			assert.deepEqual(cLikeParser('// foobar'), ['foobar']);
			assert.deepEqual(cLikeParser('//  foobar'), ['foobar']);
			assert.deepEqual(cLikeParser('//\tfoobar'), ['foobar']);
			assert.deepEqual(cLikeParser('//\t\tfoobar'), ['foobar']);
			assert.deepEqual(cLikeParser(' // foobar'), ['foobar']);
			assert.deepEqual(cLikeParser('      // foobar'), ['foobar']);
			assert.deepEqual(cLikeParser('      //  foobar'), ['foobar']);

			assert.deepEqual(cLikeParser(`
something 
// foobar
something else
`), ['foobar']);
		});

		it('returns one item of two lines', () => {
			assert.deepEqual(cLikeParser('//foo\n//bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('//foo\n// bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('// foo\n//bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('// foo\n// bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('   //foo\n   //bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('   // foo\n   // bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('\t\t//foo\n\t\t//bar'), ['foo\nbar']);
			assert.deepEqual(cLikeParser('\t\t// \tfoo\n\t\t// \tbar'), ['foo\n\tbar']);

			assert.deepEqual(cLikeParser(`
something 
// foo
// bar
something else
`), ['foo\nbar']);
		});

		it('returns several items', () => {
			assert.deepEqual(cLikeParser(`
something 
// foo
// bar
something else
// quux
lorem ipsum
`), ['foo\nbar', 'quux']);
		});

	});

	describe('when there are block comments', () => {
		it('returns one item of one line', () => {
			assert.deepEqual(cLikeParser('/*foobar*/'), ['foobar']);
			//assert.deepEqual(cLikeParser('var /*foobar*/ foo'), ['foobar']);
			assert.deepEqual(cLikeParser('asdf\n/*foobar*/\nqwer'), ['foobar']);
			assert.deepEqual(cLikeParser('asdf\n\t/*foobar*/\n\tqwer'), ['foobar']);

			assert.deepEqual(cLikeParser('/*foobar   */'), ['foobar']);
			assert.deepEqual(cLikeParser('/*foobar  \n  */'), ['foobar']);

			assert.deepEqual(cLikeParser('/**foobar*/'), ['foobar']);
			assert.deepEqual(cLikeParser('/**foobar**/'), ['foobar*']);
			assert.deepEqual(cLikeParser('/*foobar**/'), ['foobar*']);
			assert.deepEqual(cLikeParser('/*******foobar******/'), ['****foobar*****']);
		});

		it('parses asterisk-only blocks', () => {
			assert.deepEqual(cLikeParser('/*************/'), ['*********']);
		});

		it('returns one item of two lines', () => {
			assert.deepEqual(cLikeParser('/*foo\nbar*/'), ['foo\nbar']);
			assert.deepEqual(cLikeParser(`
something 
/* foo
bar */
something else
`), ['foo\nbar']);

			assert.deepEqual(cLikeParser(`
something 
/* 
foo
bar 
*/
something else
`), ['foo\nbar']);

			assert.deepEqual(cLikeParser(`
something
/****
foo
bar
****/
something else
`), ['*\nfoo\nbar\n**']);

			assert.deepEqual(cLikeParser(`
something 
/**
 * foo
 * bar 
 */
something else
`), ['foo\nbar']);

			assert.deepEqual(cLikeParser(`
something 
/**
 *foo
 *bar 
 */
something else
`), ['foo\nbar']);

			assert.deepEqual(cLikeParser(`
something 
/**
 * foo
 * bar 
 **/
something else
`), ['foo\nbar']);

		});

		it('returns several items', () => {
			assert.deepEqual(cLikeParser(`
something 
/**
 * foo
 * bar
 */
something else
/* quux */
lorem ipsum
/*foo2
bar2*/
`), ['foo\nbar', 'quux', 'foo2\nbar2']);

			assert.deepEqual(cLikeParser(`
	/* foo
	 * bar
	 * baz
	 */        
        `), ['foo\nbar\nbaz']);


			assert.deepEqual(cLikeParser(`
	/* foo
	 *
	 * bar
	 */        
        `), ['foo\n\nbar']);

			assert.deepEqual(cLikeParser(`
	/* foo

	 * bar
	 */        
        `), ['foo\n\nbar']);


		});
	});

	it('Parses correctly Leaflet\'s eachLayer comment block', () => {


		assert.deepEqual(cLikeParser(`
	/* @method eachLayer(fn: Function, context?: Object): this
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * \`\`\`
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * \`\`\`
	 */        
        `), [`@method eachLayer(fn: Function, context?: Object): this
Iterates over the layers of the map, optionally specifying context of the iterator function.
\`\`\`
map.eachLayer(function(layer){
    layer.bindPopup('Hello');
});
\`\`\``]);
	});

	it('Parses correctly Leaflet\'s Map leading comment block', () => {

		assert.deepEqual(cLikeParser(`
/*
 * @class Map
 * @aka L.Map
 * @inherits Evented
 *
 * The central class of the API — it is used to create a map on a page and manipulate it.
 *
 * @example
 *
 * \`\`\`js
 * // initialize the map on the "map" div with a given center and zoom
 * var map = L.map('map', {
 * 	center: [51.505, -0.09],
 * 	zoom: 13
 * });
 * \`\`\`
 *
 */
`), [`@class Map
@aka L.Map
@inherits Evented

The central class of the API — it is used to create a map on a page and manipulate it.

@example

\`\`\`js
// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
	center: [51.505, -0.09],
	zoom: 13
});
\`\`\``]);

	});

	it('Parses correctly Leaflet\'s VML leading comment block', () => {

		assert.deepEqual(cLikeParser(`
/*
 * @class SVG
 *
 * Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.
 *
 * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
 * with old versions of Internet Explorer.
 */
`), [`@class SVG

Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.

VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
with old versions of Internet Explorer.`]);


	});

});

