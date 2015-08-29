var util = require('util');
var Target = require('../lib/target');

var inspect = function (obj) {
  return util.inspect(obj, null, 10);
};

var config = new Target('assemble', {
  expand: true,
  dest: 'foo/',
  src: '{.*,*.*}'
});

console.log(target.config.files)

var config = new Target('example', {
  src: 'test/fixtures/*.js',
  dest: 'site/assets/'
});
console.log(inspect(config))


var config = new Target('example', {
  flatten: true,
  expand: true,
  files: [
    {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
    {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
  ]
});
console.log(inspect(config))

var config = new Target('example', {
  files: [
    {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    {src: 'test/fixtures/*.js', dest: 'site/assets/'},
  ]
});
console.log(inspect(config))

var config = new Target('example', {
  cwd: 'test/fixtures',
  files: [
    {src: '*.js', dest: 'site/a/'},
    {src: '*.js', dest: 'site/b/'},
    {src: '*.js', dest: 'site/c/'},
  ]
});
console.log(inspect(config))

var config = new Target('example', {
  cwd: 'test/fixtures',
  expand: true,
  files: [
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
  ]
});
console.log(inspect(config))

var config = new Target('example', {
  options: {
    cwd: 'test/fixtures',
    expand: true,
  },
  files: [
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
  ]
});
console.log(inspect(config))


var config = new Target('example', {
  files: {
    'foo/': ['*.js'],
  }
});

var config = new Target('example', {
  expand: true,
  files: {
    'foo/': ['*.js'],
  }
});

console.log(inspect(config))
