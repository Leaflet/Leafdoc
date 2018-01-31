/*eslint-env node,jasmine */

const cLikeParser = require('../dist/split/c-like.js');


describe('C-like parser', function () {
	describe('when there are no comments', function () {

		it('returns an empty array', () => {

			expect(cLikeParser('')).toEqual([]);
			expect(cLikeParser('foobar')).toEqual([]);
			expect(cLikeParser('1234')).toEqual([]);

			const text = `
var path$1 = require('path');
var Handlebars = require('handlebars');
var templateDir = 'basic';
`;

			expect(cLikeParser(text)).toEqual([]);
		});

	});

	describe('when there are single-line comments', function () {

		it('returns one item of one line', () => {
			expect(cLikeParser('//foobar')).toEqual(['foobar']);
			expect(cLikeParser('// foobar')).toEqual(['foobar']);
			expect(cLikeParser('//  foobar')).toEqual([' foobar']);
			expect(cLikeParser('//\tfoobar')).toEqual(['foobar']);
			expect(cLikeParser('//\t\tfoobar')).toEqual(['\tfoobar']);
			expect(cLikeParser(' // foobar')).toEqual(['foobar']);
			expect(cLikeParser('      // foobar')).toEqual(['foobar']);
			expect(cLikeParser('      //  foobar')).toEqual([' foobar']);

			expect(cLikeParser(`
something 
// foobar
something else
`)).toEqual(['foobar']);
		});

		it('returns one item of two lines', () => {
			expect(cLikeParser('//foo\n//bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('//foo\n// bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('// foo\n//bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('// foo\n// bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('   //foo\n   //bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('   // foo\n   // bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('\t\t//foo\n\t\t//bar')).toEqual(['foo\nbar']);
			expect(cLikeParser('\t\t// \tfoo\n\t\t// \tbar')).toEqual(['\tfoo\n\tbar']);

			expect(cLikeParser(`
something 
// foo
// bar
something else
`)).toEqual(['foo\nbar']);
		});

		it('returns several items', () => {
			expect(cLikeParser(`
something 
// foo
// bar
something else
// quux
lorem ipsum
`)).toEqual(['foo\nbar', 'quux']);
		});

	});

	describe('when there are block comments', function () {
		it('returns one item of one line', () => {
			expect(cLikeParser('/*foobar*/')).toEqual(['foobar']);
			expect(cLikeParser('asdf/*foobar*/qwer')).toEqual(['foobar']);
			expect(cLikeParser('asdf\n/*foobar*/\nqwer')).toEqual(['foobar']);
			expect(cLikeParser('asdf\n\t/*foobar*/\n\tqwer')).toEqual(['foobar']);

			expect(cLikeParser('/*foobar   */')).toEqual(['foobar']);
			expect(cLikeParser('/*foobar  \n  */')).toEqual(['foobar\n']);

			expect(cLikeParser('/**foobar*/')).toEqual(['foobar']);
			expect(cLikeParser('/**foobar**/')).toEqual(['foobar']);
			expect(cLikeParser('/*foobar**/')).toEqual(['foobar']);
			expect(cLikeParser('/*******foobar******/')).toEqual(['foobar']);
		});

		it('ignores asterisk-only blocks', function () {
			expect(cLikeParser('/*************/')).toEqual([]);
		});

		it('returns one item of two lines', () => {
			expect(cLikeParser('/*foo\nbar*/')).toEqual(['foo\nbar']);
			expect(cLikeParser(`
something 
/* foo
bar */
something else
`)).toEqual([' foo\nbar']);

			expect(cLikeParser(`
something 
/* 
foo
bar 
*/
something else
`)).toEqual(['\nfoo\nbar\n']);

			expect(cLikeParser(`
something 
/****
foo
bar 
****/
something else
`)).toEqual(['\nfoo\nbar\n']);

			expect(cLikeParser(`
something 
/**
 * foo
 * bar 
 */
something else
`)).toEqual(['\nfoo\nbar\n']);

			expect(cLikeParser(`
something 
/**
 *foo
 *bar 
 */
something else
`)).toEqual(['\nfoo\nbar\n']);

			expect(cLikeParser(`
something 
/**
 * foo
 * bar 
 **/
something else
`)).toEqual(['\nfoo\nbar\n']);

		});

		it('returns several items', () => {
			expect(cLikeParser(`
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
`)).toEqual(['\nfoo\nbar\n', 'quux', 'foo2\nbar2']);
		});
	});

	it('Parses correctly Leaflet\'s eachLayer comment block', function () {

		expect(cLikeParser(`
	/* foo
	 * bar
	 * baz
	 */        
        `)).toEqual(['foo\nbar\nbaz\n']);

		expect(cLikeParser(`
	/* @method eachLayer(fn: Function, context?: Object): this
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * \`\`\`
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * \`\`\`
	 */        
        `)).toEqual([`@method eachLayer(fn: Function, context?: Object): this
Iterates over the layers of the map, optionally specifying context of the iterator function.
\`\`\`
map.eachLayer(function(layer){
    layer.bindPopup('Hello');
});
\`\`\`
`]);

	});

});

