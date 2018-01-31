/*eslint-env node,jasmine */

const Leafdoc = require('../');

const fs = require('fs');


describe('e2e tests', function(){
	const dirs = fs.readdirSync('./spec/e2e');
	
	console.log('Founds e2e tests: ', dirs);
	
	for (let i in dirs) {
		const dirName = dirs[i];
		const dir = './spec/e2e/' + dirName + '/';
		
		it(dirName, function() {
			
			const expectedHtml = fs.readFileSync(dir + dirName + '.expected.html').toString();
			const expectedJson = JSON.parse(fs.readFileSync(dir + dirName + '.expected.json'));
			
			const doc = new Leafdoc();
			
			const testFiles = fs.readdirSync('./spec/e2e/' + dirName).
				filter((name)=>name !== dirName + '.html').
				filter((name)=>name !== dirName + '.json').
				sort();
			
			console.log(testFiles);
			
			testFiles.forEach((filename)=>doc.addFile('./spec/e2e/' + dirName + '/' + filename, true));
			
			const outJson = doc.outputJSON()
			const outHtml = doc.outputStr();
			
			fs.writeFileSync(dir + dirName + '.actual.json', outJson);
			fs.writeFileSync(dir + dirName + '.actual.html', outHtml);
			
			expect(JSON.parse(outJson)).toEqual(expectedJson);
			expect(outHtml).toEqual(expectedHtml);
		});
	}
	
});


// describe('Math src dode', function () {
// 	it('triggers the desired output', () => {
// 
// 		const doc = new Leafdoc();
// 
// 		doc.addStr(srcCode, true);
//         
// // 		console.log(doc.outputJSON());
// 
//         expect(JSON.parse(doc.outputJSON())).toEqual(expectedJson);
// 		expect(doc.outputStr()).toEqual(expectedDocs);
// 	});
// });

