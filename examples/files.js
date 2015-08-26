var util = require('util');
var files = require('../lib/files');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

var config = new Files({src: '*.js'});

console.log(inspect(config));
