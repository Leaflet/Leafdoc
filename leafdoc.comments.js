
// Comments renderer.
// Should work for anything that doesn't need to display anything but its comments:
//   classes and examples.

var template = require('./template');
var exampleTemplate = template('comments');


module.exports = function(documentables) {

	var out = '';
	
	for (var i in documentables) {
		var comments = '';
		for (var j in documentables[i].content) {
			comments += documentables[i].content[j][1] + '\n';	// Everything should be a comment, so [0] is skipped
		}
		
		out += exampleTemplate({comments: comments});
	}
	
	return out;
}


