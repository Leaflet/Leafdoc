
// Regexps (maybe) shared between files.

import xRegExp from 'xregexp';
import unicodeRegExpIDStart from 'regenerate-unicode-properties/Binary_Property/ID_Start.js';
import unicodeRegExpIDContinue from 'regenerate-unicode-properties/Binary_Property/ID_Continue.js';

// One or more lines starting with whitespace and two or more forward slashes,
// or
// whitespace-slash-asterisk whatever asterisk-slash.
export const commentBlock = xRegExp('^(?<multiline> ( (?!\\n) \\s*\\/{2,}\\s*.*\\n )+ ) \
| \
(\\s*\\/\\* (?<block> [\\s\\S]*?) \\*\\/)  \
', 'gmnx');

export const leafdocFile = xRegExp('^(?<block> [\\s\\S]+ )$', 'gmnx');


// Inside each line of a comment /* */ block, skips the leading spaces / asterisk (if any)
export const leadingBlock = xRegExp('^  ( \\s* \\* \\s? )?   (?<line> .* )  $', 'nx');


// Inside each line of a comment // block, skips the leading //
export const leadingLine = xRegExp('^ \\s*/{0,4}\\s{0,1} (?<line> .* )  $', 'nx');

// Inside .leafdoc files, match any line without skipping anything
export const anyLine = xRegExp('^ (?<line> .* ) $', 'nx');

// Parses a 🍂 directive, init'd at redoLeafDirective()
global.leafDirective = redoLeafDirective('🍂');

export function getLeafDirective() {
	return global.leafDirective;
} 

// Re-builds the 🍂 directive based on a different leading character
export function redoLeafDirective(char) {
	global.leafDirective = xRegExp(`  \\s* ${  char  } (?<directive> \\S+ ) (\\s+ (?<content> [^;\\n]+ )){0,1} `, 'gnx');
	return global.leafDirective;
}

// Parses an identifier, allowing only unicode ID_Start and ID_Continue characters
// An identifier allows dots in it, to allow for namespacing identifiers.
// TODO: An identifier shall allow an underscore or dollar at the beginning, as JS does.
const identifier = xRegExp.build('^(({{ID_Start}} | _ | \$)  ( {{ID_Continue}} | \\. | : )*)$', {
	ID_Start: unicodeRegExpIDStart,	// eslint-disable-line camelcase
	ID_Continue: unicodeRegExpIDContinue	// eslint-disable-line camelcase
}, 'nx');

// Parses a function name, its return type, and its parameters
// Funny thing about functions is that not all printable characters are allowed. Thus,
//   use unicode ID_Start and ID_Continue character sets via 'identifier' sub-regexp.
// eslint-disable-next-line no-useless-escape
export const functionDefinition = xRegExp.build('^ (?<name> {{identifier}} ) (?<required> (\\?{0,1}) ) \\s* (?<params> \\( .* \\) ){0,1}   \\s* ( \\: \\s* (?<type> .+? ) )? ( = \\s* (?<default> .+ ) \\s* ){0,1} \$', {
	identifier
}, 'nx');



// var functionParam = xRegExp.build('^ \\s* (?<name> {{identifier}}) \\s* ( \\: \\s* (?<type> .+ ) \\s* ) $', {identifier: identifier}, 'nx');
// var functionParam = xRegExp.build('\\s* (?<name> ( {{identifier}} | … ) \\?{0,1} ) \\s* ( \\: \\s* (?<type> [^,]+ ) \\s* ) (, | \\)) ', {identifier: identifier}, 'gnx');
export const functionParam = xRegExp.build('\\s* (?<name> ( {{identifier}} | … ) \\?{0,1} ) \\s* ( \\: \\s* (?<type> [^,]+ ) \\s* )? (, | \\)) ', {identifier}, 'gnx');



// Parses a miniclass name and its real class between parentheses.
export const miniclassDefinition = xRegExp('^ (?<miniclass> .+ ) \\s* \\( (?<realclass> .+ ) \\) $', 'nx');



// Parses a UML-like relationship definition
export const relationshipDefinition = xRegExp(`^
(?<type> \\S+ ) \\s*
(?<namespace> [^,\\s]+ ) \\s*
(, \\s* (?<cardinalityFrom> [^,\\s]*) )? \\s*
(, \\s* (?<cardinalityTo> [^,\\s]*) )? \\s*
(, \\s* (?<label> .+ )? )?
\\s* $`, 'nx');


