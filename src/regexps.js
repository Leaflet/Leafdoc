
// Regexps (maybe) shared between files.

var XRegExp = require('xregexp').XRegExp;


// One or more lines starting with whitespace and two or more forward slashes,
// or
// whitespace-slash-asterisk whatever asterisk-slash.
var commentBlock = XRegExp('^(?<multiline> ( (?!\\n) \\s*\\/{2,}\\s*.*\\n )+ ) \
| \
(\\s*\\/\\* (?<block> [\\s\\S]*?) \\*\\/)  \
','gmnx');

var leafdocFile = XRegExp('^(?<block> [\\s\\S]+ )$', 'gmnx');


// Inside each line of a comment /* */ block, skips the leading spaces / asterisk (if any)
var leadingBlock = XRegExp('^  ( \\s* \\* \\s? )?   (?<line> .* )  $','nx');


// Inside each line of a comment // block, skips the leading //
var leadingLine = XRegExp('^ \\s*/{0,4}\\s{0,1} (?<line> .* )  $','nx');

// Inside .leafdoc files, match any line without skipping anything
var anyLine = XRegExp('^ (?<line> .* ) $','nx');


// Parses a 🍂 directive, init'd at redoLeafDirective()
var leafDirective;

// Re-builds the 🍂 directive based on a different leading character
function redoLeafDirective(char) {
	return leafDirective = XRegExp('  \\s* ' + char + ' (?<directive> \\S+ ) (\\s+ (?<content> [^;\\n]+ )){0,1} ', 'gnx');
}

redoLeafDirective('🍂');


// Parses an identifier, allowing only unicode ID_Start and ID_Continue characters
// An identifier allows dots in it, to allow for namespacing identifiers.
var identifier= XRegExp.build('^({{ID_Start}}  ( {{ID_Continue}} | \\. | : )*)$', {
	ID_Start: require('unicode-7.0.0/properties/ID_Start/regex'),
	ID_Continue: require('unicode-7.0.0/properties/ID_Continue/regex')
}, 'nx');

// Parses a function name, its return type, and its parameters
// Funny thing about functions is that not all printable characters are allowed. Thus,
//   use unicode ID_Start and ID_Continue character sets via 'identifier' sub-regexp.
var functionDefinition = XRegExp.build('^ (?<name> {{identifier}} ) (?<required> (\\?{0,1}) ) \\s* (?<params> \\( .* \\) ){0,1}   \\s* ( \\: \\s* (?<type> .+? ) )? ( = \\s* (?<default> .+ ) \\s* ){0,1} \$', {
	identifier: identifier
},'nx');



// var functionParam = XRegExp.build('^ \\s* (?<name> {{identifier}}) \\s* ( \\: \\s* (?<type> .+ ) \\s* ) $', {identifier: identifier}, 'nx');
// var functionParam = XRegExp.build('\\s* (?<name> ( {{identifier}} | … ) \\?{0,1} ) \\s* ( \\: \\s* (?<type> [^,]+ ) \\s* ) (, | \\)) ', {identifier: identifier}, 'gnx');
var functionParam = XRegExp.build('\\s* (?<name> ( {{identifier}} | … ) \\?{0,1} ) \\s* ( \\: \\s* (?<type> [^,]+ ) \\s* )? (, | \\)) ', {identifier: identifier}, 'gnx');



// Parses a miniclass name and its real class between parentheses.
var miniclassDefinition = XRegExp('^ (?<miniclass> .+ ) \\s* \\( (?<realclass> .+ ) \\) $','nx');


module.exports = {
	commentBlock: commentBlock,
	leafdocFile: leafdocFile,
	leadingBlock: leadingBlock,
	leadingLine: leadingLine,
	anyLine: anyLine,
	leafDirective: leafDirective,
	functionDefinition: functionDefinition,
	functionParam: functionParam,
	miniclassDefinition: miniclassDefinition,
	redoLeafDirective: redoLeafDirective
}


