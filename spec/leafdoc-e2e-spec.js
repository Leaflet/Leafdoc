/*eslint-env node,jasmine */

const Leafdoc = require('../');


const srcCode = `
// 🍂class Math
// 🍂function rand(): Number
// Returns a random number between 0.0 and 1.0
export function rand(){
    // Do something here.
}
`;

const expectedDocs = `<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta charset="utf-8">
	<style>
	table {
		border-collapse: collapse;
	}
	table td, table th {
		border: 1px solid #888;
	}
	pre code {
		display: inline-block;
		background: #eee;
	}
	td:last-child code {
		background: #eee;
	}
	body {
		font-family: Sans;
	}
	</style>
</head>
<body>
	<h2>Leafdoc generated API reference</h2>

	<h2 id='math'>Math</h2>

<h3 id='math-function'>Functions</h3>

<section data-type='[object Object]'>


<table><thead>
	<tr>
		<th>Function</th>
		<th>Returns</th>
		<th>Description</th>
	</tr>
	</thead><tbody>
	<tr id='math-rand'>
		<td><code><b>rand</b>()</nobr></code></td>
		<td><code>Number</code></td>
		<td>Returns a random number between 0.0 and 1.0</td>
	</tr>
</tbody></table>
</section>



</body></html>`;



describe('Math src dode', function () {
	it('triggers the desired output', () => {


		const doc = new Leafdoc();

		doc.addStr(srcCode, true);

		expect(doc.outputStr()).toEqual(expectedDocs);
	});
});

