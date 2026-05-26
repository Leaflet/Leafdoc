
// Trivial file/Str parser.
// Assumes that the whole string is leafdoc docstrings.
// This is the old 'isSource=false' behaviour.

export default function trivialParser(str) {
	// Return an array with just one element, the whole string.
	return [str];
}

