var util = require('util');
var Files = require('../lib/files');

var inspect = function (obj) {
  return util.inspect(obj, null, 10);
};

// var config = new Files({
//   src: '*.js'
// });
// console.log(inspect(config));

// var config = new Files({
//   src: '*.js',
//   dest: 'foo'
// });
// console.log(inspect(config));

// var config = new Files({
//   expand: true,
//   src: '*.js',
//   dest: 'foo'
// });
// console.log(inspect(config));

// var config = new Files({
//   expand: true,
//   src: ['*.js'],
//   dest: 'foo'
// });
// console.log(inspect(config));

// var config = new Files({
//   expand: true,
//   src: ['*.js', '*.md'],
//   dest: 'foo'
// });
// console.log(inspect(config));

// var config = new Files({
//   expand: true,
//   src: ['*.js', '*.md'],
//   dest: ':foo'
// });
// console.log(inspect(config));

var config = new Files({
  src: ['lib/*.js', '*.md'],
  dest: ':foo'
});

var config = new Files({
  options: {expand: true},
  'foo/': 'lib/*.js',
  'bar/': '*.md'
});
console.log(inspect(config));

var config = new Files('lib/*.js', 'bar/', {expand: true});
// var config = new Files('lib/*.js', {expand: true});

console.log(inspect(config));
