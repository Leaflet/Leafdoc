

var LeafDoc = require('./src/leafdoc');
var doc = new LeafDoc();


// doc.addFile('src/leafdoc.js');
doc.addDir('src');



// var doc = new LeafDoc({
// 	templateDir: 'leaflet',
// 	showInheritancesWhenEmpty: true
// });

// doc.addFile('../Leaflet/src/layer/marker/Marker.js');
// doc.addFile('../Leaflet/src/layer/marker/Marker.Drag.js');
// doc.addFile('../Leaflet/src/layer/marker/Marker.Popup.js');
// doc.addFile('../Leaflet/src/layer/Popup.js');
//
// doc.addFile('../Leaflet/src/layer/tile/TileLayer.js');
// doc.addFile('../Leaflet/src/layer/tile/TileLayer.WMS.js');
// doc.addFile('../Leaflet/src/layer/ImageOverlay.js');
//
// doc.addFile('../Leaflet/src/layer/vector/Path.js');
// doc.addFile('../Leaflet/src/layer/vector/Polyline.js');
// doc.addFile('../Leaflet/src/layer/vector/Polygon.js');
// doc.addFile('../Leaflet/src/layer/vector/Rectangle.js');
// doc.addFile('../Leaflet/src/layer/vector/Circle.js');
// doc.addFile('../Leaflet/src/layer/vector/CircleMarker.js');
//
// doc.addFile('../Leaflet/src/layer/LayerGroup.js');
// doc.addFile('../Leaflet/src/layer/FeatureGroup.js');
// doc.addFile('../Leaflet/src/layer/GeoJSON.js');
// doc.addFile('../Leaflet/src/layer/tile/GridLayer.js');
//
// doc.addFile('../Leaflet/src/core/Events.js');
// doc.addFile('../Leaflet/src/layer/Layer.js');
// doc.addFile('../Leaflet/src/layer/Layer.Popup.js');


// console.log('internal namespaces are', doc._namespaces);


// console.log('status is', doc);

// console.log('calling outputStr');
var out = doc.outputStr();


var sander = require('sander');


// sander.writeFileSync('Leaflet-docs.html', out);
sander.writeFileSync('Leafdoc.html', out);

// console.log(out);

// console.log(doc._AKAs);
