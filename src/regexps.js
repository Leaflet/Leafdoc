
// Regexps (maybe) shared between files.

// An identifier: a JS-like name allowing dot and colon for namespacing.
// Uses Unicode character class escapes for ID_Start / ID_Continue:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape
const identifier = String.raw`(?:[\p{ID_Start}_$][\p{ID_Continue}.:]*)`;

// One or more lines starting with whitespace and two or more forward slashes,
// or whitespace-slash-asterisk whatever asterisk-slash.
export const commentBlock = /^(?<multiline>(?:(?!\n)\s*\/{2,}\s*.*\n)+)|(?:\s*\/\*(?<block>[\s\S]*?)\*\/)/gm;

export const leafdocFile = /^(?<block>[\s\S]+)$/gm;

// Inside each line of a comment /* */ block, skips the leading spaces / asterisk (if any)
export const leadingBlock = /^(?:\s*\*\s?)?(?<line>.*)$/;

// Inside each line of a comment // block, skips the leading //
export const leadingLine = /^\s*\/{0,4}\s?(?<line>.*)$/;

// Inside .leafdoc files, match any line without skipping anything
export const anyLine = /^(?<line>.*)$/;

// Parses a 🍂 directive, init'd at redoLeafDirective()
let leafDirective;

export function getLeafDirective() {
	return leafDirective;
}

// Re-builds the 🍂 directive based on a different leading character
export function redoLeafDirective(char) {
	leafDirective = new RegExp(`\\s*${char}(?<directive>\\S+)(?:\\s+(?<content>.+?))?(?:; |$)`, 'g');
	return leafDirective;
}

redoLeafDirective('🍂');

// Parses a function name, its return type, and its parameters.
// Capture group order (matches the indexed access in leafdoc.js):
//   1: name, 2: required, 3: params, 4: type, 5: default
export const functionDefinition = new RegExp(
	`^(?<name>${identifier})(?<required>\\??)\\s*(?<params>\\(.*\\))?\\s*(?::\\s*(?<type>.+?))?(?:=\\s*(?<default>.+)\\s*)?$`,
	'u'
);

// Capture group order: 1: name, 2: type
export const functionParam = new RegExp(
	`\\s*(?<name>(?:${identifier}|…)\\??)\\s*(?::\\s*(?<type>[^,]+)\\s*)?(?:,|\\))`,
	'gu'
);

// Parses a miniclass name and its real class between parentheses.
export const miniclassDefinition = /^(?<miniclass>.+)\s*\((?<realclass>.+)\)$/;

// Parses a UML-like relationship definition
export const relationshipDefinition = /^(?<type>\S+)\s*(?<namespace>[^,\s]+)\s*(?:,\s*(?<cardinalityFrom>[^,\s]*))?\s*(?:,\s*(?<cardinalityTo>[^,\s]*))?\s*(?:,\s*(?<label>.+)?)?\s*$/;
