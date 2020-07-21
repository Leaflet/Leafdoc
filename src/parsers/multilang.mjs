
import path from 'path';

import mec from 'multilang-extract-comments';

// Generic parser, depends on multiline-extract-comments and returns a simplified
// version of the comments data structure

export default function multilangParser(str, filename) {
	// comment-patterns dependency of mec, doesn't have support for '.mjs' modules,
	// see https://github.com/nknapp/comment-patterns/pull/9
	if (!filename || path.extname(filename) === '.mjs') {
		filename = 'leafdoc_tmp.js';
	}
	const mecBlocks = mec(str, {filename});
	const blocks = Object.values(mecBlocks).map(mecBlock => mecBlock.content.trim()).filter(block => block && block !== '');

	return blocks;
}

