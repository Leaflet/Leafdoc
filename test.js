

var LeafDoc = require('./leafdoc.js');
var doc = new LeafDoc();


// doc.addFile('leafdoc.js');
doc.addFile('../Leaflet/src/layer/marker/Marker.js');
doc.addFile('../Leaflet/src/layer/marker/Marker.Drag.js');
doc.addFile('../Leaflet/src/layer/Popup.js');
doc.addFile('../Leaflet/src/core/Events.js');
doc.addFile('../Leaflet/src/layer/Layer.js');

// console.log('internal namespaces are', doc._namespaces);


// console.log('status is', doc);

// console.log('calling outputStr');
var out = doc.outputStr();


var sander = require('sander');


sander.writeFileSync('Leaflet-docs.html', out);

// console.log(out);

// console.log(doc._AKAs);
