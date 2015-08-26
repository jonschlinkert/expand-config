var util = require('util');
var Task = require('../lib/task');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

var config = new Task('assemble', {src: '{.*,*.*}'});

console.log(config.files)
