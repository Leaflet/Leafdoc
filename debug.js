#!/usr/bin/env node

import fs from 'fs';
import Leafdoc from './src/leafdoc.js';

// const doc = new Leafdoc({templateDir: 'templates/yuml', leadingCharacter: '@'});
const doc = new Leafdoc({});

// doc.addFile('src/leafdoc.js');
doc.addDir('src');
// doc.addDir('../Leaflet/src/');

// console.log('calling outputStr');
const out = doc.outputStr();
const json = doc.outputJSON();

fs.writeFileSync('Leafdoc.html', out);
fs.writeFileSync('Leafdoc.json', json);
