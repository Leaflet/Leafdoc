/*eslint-env node,jasmine */

const Leafdoc = require('../');

const fs = require('fs');

// Runs one test for each subdirectory in /spec/e2e,
// comparing the output of running leafdoc to some expected HTML & JSON files

describe('e2e tests', () => {
	const dirs = fs.readdirSync('./spec/e2e');

	console.log('Founds e2e tests: ', dirs);

	for (const i in dirs) {
		const dirName = dirs[i];
// 		if (dirName !== 'leaflet-vml') { continue; }
		const dir = `./spec/e2e/${  dirName  }/`;

		it(dirName, () => {

			let options = {};
			try {
				options = JSON.parse(fs.readFileSync(`${dir  }leafdoc-options.json`));
			} catch (ex) {}

			const doc = new Leafdoc(options);

			const testFiles = fs.readdirSync(`./spec/e2e/${  dirName}`)
				.filter(name => !name.match(/\.html$/))
				.filter(name => !name.match(/\.dot$/))
				.filter(name => !name.match(/\.json$/))
				.sort();

			// console.log(testFiles);

			testFiles.forEach(filename => doc.addFile(`./spec/e2e/${  dirName  }/${  filename}`));

			const outJson = doc.outputJSON();
			const outHtml = doc.outputStr();
			const outExt = options.outputExtension || 'html';

			fs.writeFileSync(`${dir + dirName  }.actual.json`, outJson);
			fs.writeFileSync(`${dir + dirName  }.actual.${ outExt}`, outHtml);

			const expectedHtml = fs.readFileSync(`${dir + dirName  }.expected.${ outExt}`).toString();
			const expectedJson = JSON.parse(fs.readFileSync(`${dir + dirName  }.expected.json`));

			expect(JSON.parse(outJson)).toEqual(expectedJson);
			expect(outHtml).toEqual(expectedHtml);
		});
	}

});
