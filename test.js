

var LeafDoc = require('./leafdoc.js');
var doc = new LeafDoc();


// doc.addFile('leafdoc.js');
doc.addFile('../Leaflet/src/layer/marker/Marker.js');
doc.addFile('../Leaflet/src/layer/marker/Marker.Drag.js');

// console.log('internal namespaces are', doc._namespaces);


// console.log('status is', doc);

// console.log('calling outputStr');
var out = doc.outputStr();

console.log(out);

