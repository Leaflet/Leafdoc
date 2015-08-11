var sander = require('sander');
var template = require('./template');


/*
 * 🍂class Leafdoc
 * Represents the Leafdoc parser
 */
function Leafdoc(){
	this._namespaces = {};
};

/*
 * 🍂example
 *
 * Output Leafdoc's own documentation to the console with:
 *
 * ```
 * var LeafDoc = require('./leafdoc.js');
 * var doc = new LeafDoc();
 *
 * doc.addFile('leafdoc.js');
 * console.log( doc.outputStr() );
 * ```
 */



/*
 * 🍂method addDir
 * 🍂param dirname, String
 * 🍂param extension, String
 * 🍂returns this
 *
 * Recursively scans a directory, and parses any files that match the given `extension`
 */
Leafdoc.prototype.addDir = function(dirname, extension) {

	/// TODO
	return this;
};



/*
 * 🍂method addFile
 * 🍂param filename, String
 * 🍂returns this
 * Parses the given file
 */
Leafdoc.prototype.addFile = function(filename) {
	return this.addBuffer(sander.readFileSync(filename));
};



/*
 * 🍂method addBuffer
 * 🍂param buf, Buffer
 * 🍂returns this
 * Parses the given buffer
 */
Leafdoc.prototype.addBuffer = function(buf) {
	return this.addStr(buf.toString());
};

// Matches each comment block
Leafdoc.prototype._commentBlockRegex = new RegExp(/\/\*([\s\S]*?)\*\//gm);

// Inside a comment block, matches a line sans the leading spaces / asterisk(s)
Leafdoc.prototype._commentLineRegex = new RegExp(/^(?:[\s\*]*)(.*)[\n$]/gm);

// Inside a line, matches the leaf directive
Leafdoc.prototype._leafDirectiveRegex = new RegExp(/^🍂(\S*)(?:\s(.*))?$/);


/*
 * 🍂method addStr
 * 🍂param str, String
 * 🍂returns this
 * Parses the given string for Leafdoc comments
 */
Leafdoc.prototype.addStr = function(str) {

	var ns = '__default';	// namespace (or class)
	var sec = '__default';	// section

	// 1: Fetch comment blocks (in a regexp loop). For each block...
	var match;
	while(match = this._commentBlockRegex.exec(str)) {

		var commentBlock = match[1];
		var blockIsEmpty = true;
// 		console.log('new block');

		var lines = [];

		// 2: Strip leading asterisk and whitespace and split into lines
		while(match = this._commentLineRegex.exec(commentBlock)) {
			var lineStr = match[1];

			// 3: Parse 🍂 directives
			match = this._leafDirectiveRegex.exec(lineStr);
			if (match) {
				if (match[1] === 'class' || match[1] === 'namespace') {
					ns = match[2];
				}
				if (match[1] === 'section') {
					currentSection = match[2];
				}
				lines.push([match[1], match[2]]);
				blockIsEmpty = false;
			} else {
				if (!blockIsEmpty) {
					lines.push(['comment', lineStr]);
				}
			}
		}

		var block = {
			type: lines[0][0],
			name: lines[0][1],
			content: lines.slice(1)
		};

		if (!this._namespaces.hasOwnProperty(ns)) {
			this._namespaces[ns] = {};
		}
		if (!this._namespaces[ns].hasOwnProperty(sec)) {
			this._namespaces[ns][sec] = [];
		}

		this._namespaces[ns][sec].push(block);
// 		console.log(this._namespaces);
	}


// 	console.log(this._namespaces.Leafdoc.__default[0]);
// 	console.log('namespaces after addStr', this._namespaces);

	return this;
};


/*
 * 🍂method outputStr
 * 🍂returns String
 * Outputs the documentation to a string.
 * Use only after all the needed files have been parsed.
 */
Leafdoc.prototype.outputStr = function() {

	var out = '';
	for (var ns in this._namespaces) {

// 		out += '<h2>' + ns + '</h2>';
// 		console.log('outputting namespace', ns);
		out += this._stringifyNamespace(ns, this._namespaces[ns]);
	}
	
	return (template('html'))({body: out});
	
};



Leafdoc.prototype._stringifyNamespace = function(name, sections) {

	var out = '';
	out += '<h2>' + name + '</h2>';

	/* Loop through sections to get all methods, all options, all events, etc.,
	 * go get all kinds of documentables together, then group them by
	 * type of documentable, *then* by section.
	 */
	var types = {};
	for (var sec in sections) {

// 		out += this._stringifySections(sec, this._namespaces[ns]);

		for (var i in sections[sec]) {
			var documentable = sections[sec][i];
			var type = documentable.type;

// 			console.log('type:', type);

			if (!types.hasOwnProperty(type)) {
				types[type] = {};
			}
			if (!types[type].hasOwnProperty(sec)) {
				types[type][sec] = [];
			}

			types[type][sec].push(documentable);
		}
	}

	for (var type in types) {

		out += '<h3>' + this._stringifyType(type) + '</h3>\n';

		for (var sec in types[type]) {

			if (sec !== '__default') {
				out += '<h4>' + sec + '</h4>\n';
			}

			var docs = types[type][sec]
			
			if (type === 'method') {
				out += (require('./leafdoc.method'))(docs);
			} else if (type === 'example') {
				out += (require('./leafdoc.comments'))(docs);
			} else if (type === 'class') {
				out += (require('./leafdoc.comments'))(docs);
				/// FIXME: Add the rest of documentable types (static functions, options, events)
			} else {
				for (var i in docs) {
					var documentable = docs;
					out += '<p>' + documentable.name + '</p>\n';
				}
			}
		}
	}

	return out;
};


Leafdoc.prototype._stringifyType = function(type) {
	if (type === 'method') return 'Methods';
	if (type === 'example') return 'Example';
	if (type === 'class') return '';	// Because the class/namespace name is an <h2> already.
	
	return type;
};



module.exports = Leafdoc;
