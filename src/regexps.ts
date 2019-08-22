
// Regexps (maybe) shared between files.

import {XRegExp} from 'xregexp';


// One or more lines starting with whitespace and two or more forward slashes,
// or
// whitespace-slash-asterisk whatever asterisk-slash.
export const commentBlock = XRegExp('^(?<multiline> ( (?!\\n) \\s*\\/{2,}\\s*.*\\n )+ ) \
| \
(\\s*\\/\\* (?<block> [\\s\\S]*?) \\*\\/)  \
', 'gmnx');

export const leafdocFile = XRegExp('^(?<block> [\\s\\S]+ )$', 'gmnx');


// Inside each line of a comment /* */ block, skips the leading spaces / asterisk (if any)
export const leadingBlock = XRegExp('^  ( \\s* \\* \\s? )?   (?<line> .* )  $', 'nx');


// Inside each line of a comment // block, skips the leading //
export const leadingLine = XRegExp('^ \\s*/{0,4}\\s{0,1} (?<line> .* )  $', 'nx');

// Inside .leafdoc files, match any line without skipping anything
export const anyLine = XRegExp('^ (?<line> .* ) $', 'nx');



// Re-builds the 🍂 directive based on a different leading character
export function redoLeafDirective(char: string): any {
	return leafDirective = XRegExp('  \\s* ' + char + ' (?<directive> \\S+ ) (\\s+ (?<content> [^;\\n]+ )){0,1} ', 'gnx');
}

// Parses a 🍂 directive, init'd at redoLeafDirective()
export let leafDirective = redoLeafDirective('🍂');


// Parses an identifier, allowing only unicode ID_Start and ID_Continue characters
// An identifier allows dots in it, to allow for namespacing identifiers.
var identifier = XRegExp.build('^({{ID_Start}}  ( {{ID_Continue}} | \\. | : )*)$', {
	ID_Start: require('unicode-7.0.0/properties/ID_Start/regex'),
	ID_Continue: require('unicode-7.0.0/properties/ID_Continue/regex')
}, 'nx');

// Parses a function name, its return type, and its parameters
// Funny thing about functions is that not all printable characters are allowed. Thus,
//   use unicode ID_Start and ID_Continue character sets via 'identifier' sub-regexp.
export const functionDefinition = XRegExp.build('^ (?<name> {{identifier}} ) (?<required> (\\?{0,1}) ) \\s* (?<params> \\( .* \\) ){0,1}   \\s* ( \\: \\s* (?<type> .+? ) )? ( = \\s* (?<default> .+ ) \\s* ){0,1} \$', {
	identifier: identifier
}, 'nx');



// var functionParam = XRegExp.build('^ \\s* (?<name> {{identifier}}) \\s* ( \\: \\s* (?<type> .+ ) \\s* ) $', {identifier: identifier}, 'nx');
// var functionParam = XRegExp.build('\\s* (?<name> ( {{identifier}} | … ) \\?{0,1} ) \\s* ( \\: \\s* (?<type> [^,]+ ) \\s* ) (, | \\)) ', {identifier: identifier}, 'gnx');
export const functionParam = XRegExp.build('\\s* (?<name> ( {{identifier}} | … ) \\?{0,1} ) \\s* ( \\: \\s* (?<type> [^,]+ ) \\s* )? (, | \\)) ', {identifier: identifier}, 'gnx');



// Parses a miniclass name and its real class between parentheses.
export const miniclassDefinition = XRegExp('^ (?<miniclass> .+ ) \\s* \\( (?<realclass> .+ ) \\) $', 'nx');

