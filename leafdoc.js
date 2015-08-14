var sander = require('sander');
var template = require('./template');


/*
 * 🍂class Leafdoc
 * Represents the Leafdoc parser
 */
function Leafdoc(){
	this._namespaces = {};
	this._knownDocumentables = [
		'example',
		'factory',
		'option',
		'event',
		'method',
		'function',
		'property'
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

	// Temporal placeholder - section comments and AKAs are dangling until
	// the documentable type is known
	var sectionComments = [];
	var sectionAKA = [];

	// 1: Fetch comment blocks (in a regexp loop). For each block...
	var match;
	while(match = this._commentBlockRegex.exec(str)) {

		var commentBlock = match[1];
		var blockIsEmpty = true;
// 		console.log('new block: ', commentBlock);
// 		console.log('new block');

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

						var split;
						if (content) {
							split = content.split(',');
						} else {
							split = ['__default'];
						}
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

						var paramType = split[1] ? split[1].trim() : '';
						currentDocumentable.params[paramName] = {name: paramName, type: paramType};

					} else if (directive === 'aka') {
						currentDocumentable.aka.push(content);
					} else if (directive === 'comment') {
// 						console.log('Doing stuff with a method comments: ', content);
						currentDocumentable.comments.push(content);
					}

				}

			}

		}

	}

// 	console.log(this._namespaces.Leafdoc.__default[0]);
// 	console.log(this._namespaces.Marker.__default[0]);
// 	console.log(this._namespaces);
// 	console.log(this._namespaces.Marker.supersections.method.sections.__default);
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
		out += this._stringifyNamespace(this._namespaces[ns]);
	}
	
	return (template('html'))({body: out});
	
};

Leafdoc.prototype._stringifyNamespace = function(namespace) {
	var out = '';

	/// Ensure explicit order of the supersections (known types of documentable:
	/// example, factory, options, events, methods, properties
	for (var i in this._knownDocumentables) {
		var s = this._knownDocumentables[i];
		if (namespace.supersections.hasOwnProperty(s)) {
			out += this._stringifySupersection(namespace.supersections[s]);
		}
	}

// 	console.log(namespace);

	return (template('namespace'))({
		name: namespace.name,
		comments: namespace.comments,
		supersections: out
	});
};



Leafdoc.prototype._stringifySupersection = function(supersection) {
	var out = '';

	for (var s in supersection.sections) {
		out += this._stringifySection(supersection.sections[s], supersection.name);
	}

	var name = supersection.name;

	if (name === 'method') name = 'Methods';
	if (name === 'function') name = 'Functions';
	if (name === 'factory') name = 'Creation';
	if (name === 'example') name = 'Usage example';
	if (name === 'event') name = 'Events';
	if (name === 'option') name = 'Options';
	if (name === 'property') name = 'Properties';

	return (template('supersection'))({
		name: name,
		comments: supersection.comments,
		sections: out
	});
};


Leafdoc.prototype._stringifySection = function(section, documentableType) {
	var name = section.name === '__default' ? '' : section.name;

// 	if (name) console.log('Named section:', name);
	
	return (template('section'))({
		name: name,
		comments: section.comments,
		documentables:(template(documentableType))({
			documentables: section.documentables
		})
	});
};


Leafdoc.prototype._stringifyType = function(type) {
	if (type === 'method') return 'Methods';
	if (type === 'example') return 'Example';
	if (type === 'class') return '';	// Because the class/namespace name is an <h2> already.
	
	return type;
};



module.exports = Leafdoc;
