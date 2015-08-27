


//// TODO: use XRegExp



var identifier = require('../regexps').identifier;


// var functionRegex = /^(\w+)\s*(?:\((.*)\))?(?:[:,]\s*(\w+))?/;
var functionRegex = "^(\\w+)\\s*(?:\\((.*)\\))?(?:[:,]\\s*(\\w+))?";
// var functionRegex = "(\\w+)";

functionRegex = new RegExp(functionRegex.replace("\\w+", identifier, 'g'));
// functionRegex = new RegExp(functionRegex);


var match = functionRegex.exec("foobar   (bar: Str, foo:  Int,quux:Bool): ReturnType");
// var match = functionRegex.exec("foobar");
console.log(match);




// module.exports = functionFactory;
