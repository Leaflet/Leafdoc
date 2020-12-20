
import mec from 'multilang-extract-comments';

// Generic parser, depends on multiline-extract-comments and returns a simplified
// version of the comments data structure

export default function multilangParser(str, filename) {
	const mecBlocks = mec(str, {filename: filename || 'leafdoc_tmp.js'});
	const blocks = Object.values(mecBlocks).map(mecBlock => mecBlock.content.trim()).filter(block => block && block !== '');

	return blocks;
}

