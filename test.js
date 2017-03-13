#!/usr/bin/env js


var LeafDoc = require('./src/leafdoc');
// var doc = new LeafDoc({templateDir: 'templates/yuml', leadingCharacter: '@'});
var doc = new LeafDoc({});

// doc.addFile('src/leafdoc.js');
doc.addDir('src');
// doc.addDir('../Leaflet/src/');

// console.log('calling outputStr');
var out = doc.outputStr();
var json = doc.outputJSON();

var sander = require('sander');
sander.writeFileSync('Leafdoc.html', out);
sander.writeFileSync('Leafdoc.json', json);
