
// Method renderer.

var template = require('./template');
var methodsTemplate = template('methods');
var methodTemplate = template('method');


module.exports = function(documentables) {

	var out = '';
	
	for (var i in documentables) {
		var documentable = documentables[i];
		var params = [];
		var description = '';
		var returns = '-';

		for (var j in documentable.content) {
			var directive = documentable.content[j][0];
			var content = documentable.content[j][1];
			if (directive === 'comment') {
				description += content + '\n';
			}
			if (directive === 'param') {
				params.push(content);
			}
			if (directive === 'returns') {
				returns = content;
			}
		}

		for (var i in params) {
			var split = params[i].split(', ');
			params[i] = {name: split[0], type: split[1]};
		}

		out += methodTemplate({
			name: documentable.name,
			params: params,
			returns: returns,
			description: description
		});
	}

	return methodsTemplate({rows: out});
}


