
// Regexps (maybe) shared between files.

var XRegExp = require('xregexp').XRegExp;


// One or more lines starting with whitespace and two or more forward slashes,
// or
// whitespace-slash-asterisk whatever asterisk-slash
var commentBlock = XRegExp('^(?<multiline> (\\s*\\/{2,}\\s*.*\\n)+ ) \
| \
(\\s*\\/\\* (?<block> [\\s\\S]*?) \\*\\/)  \
','gmnx');




// Inside each line of a comment /* */ block, skips the leading spaces / asterisk (if any)
var leadingBlock = XRegExp('^  ( \\s* \\* \\s? )?   (?<line> .* )  $','nx');


// Inside each line of a comment // block, skips the leading //
var leadingLine = XRegExp('^ \\s*/{0,4}\\s{0,1} (?<line> .* )  $','nx');


// Parses a 🍂 directive
var leafDirective = XRegExp('^  \\s* 🍂 (?<directive> \\S+ ) (\\s+ (?<content> .+ )){0,1}  $', 'nx');




// Parses an identifier, allowing only unicode ID_Start and ID_Continue characters
var identifier= XRegExp.build('^({{ID_Start}}{{ID_Continue}}*)$', {
	ID_Start: require('unicode-7.0.0/properties/ID_Start/regex'),
	ID_Continue: require('unicode-7.0.0/properties/ID_Continue/regex')
});

// Parses a function name, its return type, and its parameters
// Funny thing about functions is that not all printable characters are allowed. Thus,
//   use unicode ID_Start and ID_Continue character sets via 'identifier' sub-regexp.
var functionDefinition = XRegExp.build('^ (?<name> {{identifier}} ) \\s* (?<params> \\( .* \\) ){0,1}   \\s* ( \\: \\s* (?<type> .+? ) )? ( = \\s* (?<default> .+ ) \\s* ){0,1} \$', {
	identifier: identifier
},'nx');


// var functionParam = XRegExp.build('^ \\s* (?<name> {{identifier}}) \\s* ( \\: \\s* (?<type> .+ ) \\s* ) $', {identifier: identifier}, 'nx');
var functionParam = XRegExp.build('\\s* (?<name> {{identifier}}) \\s* ( \\: \\s* (?<type> .+ ?) \\s* ) \\b,? ', {identifier: identifier}, 'gnx');




module.exports = {
	commentBlock: commentBlock,
	leadingBlock: leadingBlock,
	leadingLine: leadingLine,
	leafDirective: leafDirective,
	functionDefinition: functionDefinition,
	functionParam: functionParam
}


