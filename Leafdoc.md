# Leafdoc-generated API reference

## Command-line usage

<p>Leafdoc includes a small command-line utility, useful when running from a console or a shell script, accepting some of the Leafdoc options. The syntax is:</p>
<p><code>leafdoc [options] [files]</code></p>


### Usage example







<p><code>leafdoc -t templates/pretty -c '@' --verbose -o documentation.html src</code></p>






### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='command-line-usage-template'>
		<td><code><b>template</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;templates/basic&#x27;</code></td>
		<td>Akin to <a href="#leafdoc.templatedir">Leafdoc.templateDir</a></td>
	</tr>
	<tr id='command-line-usage-t'>
		<td><code><b>t</b></code></td>
		<td><code></code>
		<td><code></code></td>
		<td>Alias of <code>template</code></td>
	</tr>
	<tr id='command-line-usage-character'>
		<td><code><b>character</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;🍂&#x27;</code></td>
		<td>Akin to <a href="#leafdoc.leadingcharacter">Leafdoc.leadingCharacter</a></td>
	</tr>
	<tr id='command-line-usage-c'>
		<td><code><b>c</b></code></td>
		<td><code></code>
		<td><code></code></td>
		<td>Alias of <code>character</code></td>
	</tr>
	<tr id='command-line-usage-verbose'>
		<td><code><b>verbose</b></code></td>
		<td><code>Boolean</code>
		<td><code>false</code></td>
		<td>Akin to <a href="#leafdoc.verbose">Leafdoc.verbose</a></td>
	</tr>
	<tr id='command-line-usage-v'>
		<td><code><b>v</b></code></td>
		<td><code></code>
		<td><code></code></td>
		<td>Alias of <code>verbose</code></td>
	</tr>
	<tr id='command-line-usage-output'>
		<td><code><b>output</b></code></td>
		<td><code>String</code>
		<td><code>undefined</code></td>
		<td>File to write the documentation to. If left empty, documentation will be outputted to <code>stdout</code> instead.</td>
	</tr>
	<tr id='command-line-usage-o'>
		<td><code><b>o</b></code></td>
		<td><code></code>
		<td><code></code></td>
		<td>Alias of <code>output</code>
Alias of <code>output</code></td>
	</tr>
	<tr id='command-line-usage-json'>
		<td><code><b>json</b></code></td>
		<td><code>Boolean</code>
		<td><code>false</code></td>
		<td>Write the internal JSON representation of the documentation instead of a templated HTML file.</td>
	</tr>
</tbody></table>





## Leafdoc

<p>Represents the Leafdoc parser</p>


### Usage example







<p>Output Leafdoc's own documentation to the console with:</p>
<pre><code>var LeafDoc = require('./src/leafdoc.js');
var doc = new LeafDoc();
	doc.addFile('src/leafdoc.js');

console.log( doc.outputStr() );
</code></pre>






### Constructor






<table><thead>
	<tr>
		<th>Constructor</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='leafdoc-leafdoc'>
		<td><code>new <b>Leafdoc</b>(<nobr>&lt;<a href='#leafdoc-option'>Leafdoc options</a>&gt; <i>options</i></nobr>)</nobr></code></td>
		<td>Constructor for a new Leafdoc parser</td>
	</tr>
</tbody></table>




### Options






<table><thead>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='leafdoc-templatedir'>
		<td><code><b>templateDir</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;templates/basic&#x27;</code></td>
		<td>Defines which subdirectory (relative to the directory the curent JS
script is running) holds the handlebars template files for building up the HTML.</td>
	</tr>
	<tr id='leafdoc-showinheritanceswhenempty'>
		<td><code><b>showInheritancesWhenEmpty</b></code></td>
		<td><code>Boolean</code>
		<td><code>false</code></td>
		<td>When <code>true</code>, child classes/namespaces will display documentables from ancestors, even if the child class doesn't have any of such documentables.
e.g. display inherited events even if the child doesn't define any new events.</td>
	</tr>
	<tr id='leafdoc-leadingcharacter'>
		<td><code><b>leadingCharacter</b></code></td>
		<td><code>String</code>
		<td><code>&#x27;🍂&#x27;</code></td>
		<td>Overrides the Leaf symbol as the leading character for documentation lines.
See also <a href="#leafdoc-setleadingcharacter"><code>setLeadingCharacter</code></a>.</td>
	</tr>
	<tr id='leafdoc-customdocumentables'>
		<td><code><b>customDocumentables</b></code></td>
		<td><code>Map</code>
		<td><code>{}</code></td>
		<td>A key-value map. Each pair will be passed to <a href="#leafdoc-registerdocumentable"><code>registerDocumentable</code></a>.</td>
	</tr>
	<tr id='leafdoc-verbose'>
		<td><code><b>verbose</b></code></td>
		<td><code>Boolean</code>
		<td><code>false</code></td>
		<td>Set to <code>true</code> to display more information as files are being read.</td>
	</tr>
</tbody></table>




### Methods






<table><thead>
	<tr>
		<th>Method</th>
		<th>Returns</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='leafdoc-registerdocumentable'>
		<td><code><b>registerDocumentable</b>(<nobr>&lt;String&gt; <i>name</i></nobr>, <nobr>&lt;String&gt; <i>label?</i></nobr>, <nobr>&lt;Boolean&gt; <i>inheritable?</i></nobr>)</nobr></code></td>
		<td><code>this</code></td>
		<td>Registers a new documentable type, beyond the preset ones (function,
property, etc). New documentable should also not be an already used
keyword (class, namespace, inherits, etc).
When registering new documentables, make sure that there is an appropriate
template file for it.
Set <code>label</code> to the text for the sections in the generated docs.
<code>inheritable</code> parameter determines documentable can be inherited via inherits keyword in a subclass.</td>
	</tr>
	<tr id='leafdoc-gettemplateengine'>
		<td><code><b>getTemplateEngine</b>()</nobr></code></td>
		<td><code>Handlebars</code></td>
		<td>Returns handlebars template engine used to render templates.
You can use it for override helpers or register a new one.</td>
	</tr>
	<tr id='leafdoc-setleadingcharacter'>
		<td><code><b>setLeadingCharacter</b>(<nobr>&lt;String&gt; <i>char</i></nobr>)</nobr></code></td>
		<td><code>this</code></td>
		<td>In the rare case you don't want to use 🍂 as the leading character for
leaf directives, run this function with the desired character, e.g.
<code>setLeadingCharacter('@');</code>
The new leading character will apply only to files/dirs/strings parsed from
that moment on, so it's a good idea to call this before anything else.</td>
	</tr>
	<tr id='leafdoc-adddir'>
		<td><code><b>addDir</b>(<nobr>&lt;String&gt; <i>dirname</i></nobr>, <nobr>&lt;String[]&gt; <i>extensions?</i></nobr>)</nobr></code></td>
		<td><code>this</code></td>
		<td>Recursively scans a directory, and parses any files that match the
given <code>extensions</code> (by default <code>.js</code> and <code>.leafdoc</code>, mind the dots).
Files with a <code>.leafdoc</code> extension will be treated as leafdoc-only
instead of source.</td>
	</tr>
	<tr id='leafdoc-addfile'>
		<td><code><b>addFile</b>(<nobr>&lt;String&gt; <i>filename</i></nobr>)</nobr></code></td>
		<td><code>this</code></td>
		<td>Parses the given file using <a href="#leafdoc-addbuffer"><code>addBuffer</code></a>.</td>
	</tr>
	<tr id='leafdoc-addbuffer'>
		<td><code><b>addBuffer</b>(<nobr>&lt;Buffer&gt; <i>buf</i></nobr>, <nobr>&lt;String&gt; <i>filename?</i></nobr>)</nobr></code></td>
		<td><code>this</code></td>
		<td>Parses the given buffer using <a href="#leafdoc-addstr"><code>addStr</code></a> underneath.</td>
	</tr>
	<tr id='leafdoc-addstr'>
		<td><code><b>addStr</b>(<nobr>&lt;String&gt; <i>str</i></nobr>, <nobr>&lt;String&gt; <i>filename?</i></nobr>)</nobr></code></td>
		<td><code>this</code></td>
		<td>Parses the given string for Leafdoc comments.
directive.</td>
	</tr>
	<tr id='leafdoc-outputstr'>
		<td><code><b>outputStr</b>()</nobr></code></td>
		<td><code>String</code></td>
		<td>Outputs the documentation to a string.
Use only after all the needed files have been parsed.</td>
	</tr>
	<tr id='leafdoc-outputjson'>
		<td><code><b>outputJSON</b>()</nobr></code></td>
		<td><code>String</code></td>
		<td>Outputs the internal documentation tree to a JSON blob, without any formatting.
Use only after all the needed files have been parsed.</td>
	</tr>
</tbody></table>






