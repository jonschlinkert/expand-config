var stringify = require('stringify-object');
var util = require('util');
var Config = require('../');

function config(obj) {
  var res = stringify(new Config(obj), {
    singleQuotes: true,
    indent: '  '
  });
  console.log(res);
}

config({
  // foo: 'test/fixtures',
  foo: 'a',
  options: {process: true},
  assemble: {
    foo: 'c',
    site: {
      foo: 'd',
      src: '<%= foo %>/*.js',
      dest: '<%= foo %>/site'
    },
    blog: {
      src: '<%= foo %>/*.txt',
      dest: '<%= foo %>/site/blog'
    }
  }
});
