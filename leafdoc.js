var sander = require('sander');
var template = require('./template');


/*
 * 🍂class Leafdoc
 * Represents the Leafdoc parser
 */
function Leafdoc(){
	this._namespaces = {};
	this._knownDocumentables = [
		'method',
		'function',
		'event',
		'option',
		'factory'
	];
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
Leafdoc.prototype._commentLineRegex = new RegExp(/^(?:[\s\*]*)(.*)\n?/gm);

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
	var dt = '';	// Type of documentable
	var dc = '';	// Name of documentable

	// Scope of the current line (parser state): ns, sec or dc.
	// (namespace, section, documentable)
	var scope = '';

	var namespaces = this._namespaces;

	var currentNamespace, currentSection, currentDocumentable;
	var sectionComments = [];
	var sectionAKA = [];

	// 1: Fetch comment blocks (in a regexp loop). For each block...
	var match;
	while(match = this._commentBlockRegex.exec(str)) {

		var commentBlock = match[1];
		var blockIsEmpty = true;
// 		console.log('new block: ', commentBlock);
// 		console.log('new block');

		// Temporal placeholder - section comments and AKAs are dangling until
		// the documentable type is known

		// 2: Strip leading asterisk and whitespace and split into lines
		while(match = this._commentLineRegex.exec(commentBlock)) {
			var lineStr = match[1];
			var validLine = false;
			var directive, content;

			// 3: Parse 🍂 directives
			match = this._leafDirectiveRegex.exec(lineStr);
			if (match) {
				// In "🍂param foo, bar", directive is "param" and content is "foo, bar"
				directive = match[1];
				content = match[2];
				validLine = true;
// 				console.log(match);
				if (directive === 'class' || directive === 'namespace') {
					ns = content;
					scope = 'ns';
				} else if (directive === 'section') {
					sec = content || '__default';
					scope = 'sec';
				} else if (this._knownDocumentables.indexOf(directive) !== -1 ) {
					scope = 'dc';
					dt = directive;
					dc = '';	// The name of the documentable will be set later
				}

				blockIsEmpty = false;
			} else {
				if (!blockIsEmpty) {
					directive = 'comment';
					content = lineStr;
					validLine = true;
				}
			}


			if (validLine) {

// 				console.log(scope, '-', directive, '-', content);


				if (scope === 'ns') {
					if (!namespaces.hasOwnProperty(ns)) {
						namespaces[ns] = {
							name: ns,
							aka: [],
							comments: [],
							supersections: {}
						};
					}

					if (directive === 'aka') {
						namespaces[ns].aka.push(content);
					}
					if (directive === 'comment') {
						namespaces[ns].comments.push(content);
					}

					currentNamespace = namespaces[ns];
				}

				if (scope === 'sec') {
					if (directive === 'comment') {
						sectionComments.push(content);
					}
					if (directive === 'aka') {
						sectionAKA.push(content);
					}
				}

				if (scope === 'dc') {
					if (!currentNamespace.supersections.hasOwnProperty(dt)) {
						currentNamespace.supersections[dt] = {
							name: dt,
							aka: [],
							comments: [],
							sections: {}
						};
					}
					if (!currentNamespace.supersections[dt].sections.hasOwnProperty(sec)) {
						currentNamespace.supersections[dt].sections[sec] = {
							name: sec,
							aka: sectionAKA,
							comments: sectionComments,
							documentables: {}
						};
						sectionAKA = [];
						sectionComments = [];
					}
					currentSection = currentNamespace.supersections[dt].sections[sec];

// 					console.log(currentSection);

// 					console.log(directive);

					if (this._knownDocumentables.indexOf(directive) !== -1 ) {
						// Documentables might have more than their name as content.
						// By default, type (or return type) is second, default value is third.
						var split = content.split(',');
						dc = split[0].trim();

						if (!currentSection.documentables.hasOwnProperty(dc)) {
							currentSection.documentables[dc] = {
								name: dc,
								aka: [],
								comments: [],
								params: {},	// Only for functions/methods/factories
								type: (split[1] ? split[1].trim() : null),
								defaultValue: (split[2] ? split[2].trim() : null)	// Only for options
							}
						}
						currentDocumentable = currentSection.documentables[dc];

					} else if (directive === 'param') {
						// Params are param name, type.
						/// TODO: Think about default values, or param explanation.
						var split = content.split(',');
						var paramName = split[0].trim();
						var paramType = split[1].trim();
						currentDocumentable.params[paramName] = paramType;

					} else if (directive === 'aka') {
						currentDocumentable.aka.push(content);
					} else if (directive === 'comment') {
// 						console.log('Doing stuff with a method comments: ', content);
						currentDocumentable.comments.push(content);
					}


				}
//
// 				console.log('line: ', line);
//
// 				if (scope === 'ns') {
//
// 				}
// 				namespaces[ns][sec].push(line);
			}


		}


		// 4: Organize all parsed directives into documentables
		// 5: Add documentables to the global namespaces

		/// TODO: Manage AKAs
		/// TODO: Assign unique IDs to every namespace, section and documentable

// 		for (var ns in namespaces) {
//
// 			// Assign comments to this namespace
//
// 			for (var sec in namespaces[ns]) {
//
// 				// What is the first type of documentable in this section?
// 				// We need to know that to apply comments.
//
// 			}
// 		}


// 		if (lines.length) {
// // 			var block = {
// // 				type: lines[0][0],
// // 				name: lines[0][1],
// // 				content: lines.slice(1)
// // 			};
// //
// 		}




// 		console.log(lines);

// 		console.log(this._namespaces);
	}


// 	console.log(this._namespaces.Leafdoc.__default[0]);
// 	console.log(this._namespaces.Marker.__default[0]);
	console.log(this._namespaces);
	console.log(this._namespaces.Marker.supersections.method.sections.__default);
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
