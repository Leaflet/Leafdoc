
// Regexp and their explanation:

//    ^|\n|\r                                Starts at beginning, or after newline
// (?:       )                               Non-capturing group
//                             \/\/          Two forward slashes
//                                 .*        Any number of non-newline characters
//                          \s*              Any number of whitespace before the slashes...
//                (?![\n\r])                 ...but not a newline.
//                                   \s      A whitespace/newline at the end
//                                     ?     But just maybe?
//                (?![\n\r])\s*\/\/.*\s?     Whitespace, slashes, text, maybe a newline
//             (                        )+   One or more comment lines
//             (?:                      )    Do not capture individual lines
//            (                           )  Capture the whole set of contiguous lines instead
//
// (?:^|\n|\r)((?:(?![\n\r])\s*\/\/.*\s?)+)


//                   [\s\S]+         Any character, 1 or more times
//                          ?        But lazy, in order to not match ending asterisks
//                  (        )       Capture this
//                            \*+    At least one asterisk at the end...
//                               \/  ...and just one forward slash.
//    \/                             Just one forward slash at the beginning...
//      \*+                          ...and at least one asterisk
//         (?!\*|\/)                 Do not match if the next thing is an asterisk or slash
//                                     (if not, this will match "/****/ foobar /* */" whole)
//                                     (i.e. the first character of [\s\S]+ must be non-asterisk,
//                                      non-slash)
// (?:                             ) Do not capture the whole thing
// (?:\/\*+(?!\*|\/)([\s\S]+?)\*+\/)


// (      multiple single lines           )|(            block              )
// (?:^|\n|\r)((?:(?![\n\r])\s*\/\/.*\s?)+)|(?:\/\*+(?!\*|\/)([\s\S]+?)\*+\/)


const commentRegexp = /(?:^|\n|\r)((?:(?![\n\r])\s*\/\/.*\s?)+)|(?:\/\*+(?!\*|\/)([\s\S]+?)\*+\/)/g;

const leadingDoubleSlashRegexp = /\s\/\//;

// Parser for c-like files/strings
// Parses:
// - Comment blocks with /* */, ignoring any extra asterisk like /** */ and /*** ***/
// - Single-line comments with //, prepended only by whitespace
// - Joins multiple single-line comments as a single block
// - The *first* whitespace (or tab) of all single-line comments is ignored

export default function cLikeParser(str) {
	let match;
	let parsed = [];

	while (match = commentRegexp.exec(str)) {

		const multilineComment = match[1];
		const blockComment = match[2];

		if (multilineComment) {
			const cleanMultiline = multilineComment
				.split('\n')
				.filter((line)=>line !== '')
				.map((line)=>
					line
						.replace(/\s*\/\/\s?/, '') // Remove leading double slash, *first* whitespace
						.replace(/\s*$/, '') // Remove trailing whitespace
				)
				.join('\n');

			parsed.push(cleanMultiline);
		} else if (blockComment) {

			let lines = blockComment.split('\n');

			if (lines.length === 1) {
				// Just trim whitespace around
				lines[0] = lines[0].trim();
			} else {
				let firstLine = lines[0];
				const lastLine = lines[lines.length - 1];


				let middleLines = lines.slice(1, lines.length - 1); // Skip the first and last lines

				// Remove as much leading whitespace as the last line and then an asterisk,
				// if every line in the middle of block has that much whitespace and then an asterisk
				if (lastLine.trim() === '') {
					const lastLineRegexp = new RegExp('^' + lastLine + '\\*');
					if (middleLines.every((line)=>line.match(lastLineRegexp))) {
						middleLines = middleLines.map((line)=>line.replace(/^\s*\*/, ''));
						// Remove one leading whitespace, if every line in the middle block has it
						// (or the line is empty)
						if (middleLines.every((line)=>line.match(/^\s/) || line === '')) {
							middleLines = middleLines.map((line)=>line.replace(/^\s/, ''));
							firstLine = firstLine.replace(/^\s/, '');
						}
					}
				}
				lines = ([firstLine]).concat(middleLines, [lastLine]);
				// console.log(JSON.stringify(blockComment), ",", JSON.stringify(lastLine), '→', lines.map(JSON.stringify));
			}

			const cleanBlock = lines
				.map((line)=> line.replace(/\s*$/, '')) // Remove trailing whitespace
				.join('\n');

			parsed.push(cleanBlock);
		}
	}
	return parsed;
}

