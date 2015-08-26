var util = require('util');
var Task = require('../lib/task');
var Config = require('../');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

// var config = require('..')({
//   lint: {
//     options: {expand: true},
//     foo: {src: '*.js'},
//     bar: {src: '*.js'}
//   },
//   copy: {
//     foo: {src: '*.js'},
//     bar: {src: '*.js'}
//   }
// });
// console.log(inspect(config));

// { options: {},
//   tasks:
//    { lint:
//       { options: {},
//         targets:
//          { foo:
//             { options: {},
//               files:
//                [ { taskname: 'lint',
//                    targetname: 'foo',
//                    options: {},
//                    src: [ 'index.js' ] } ] },
//            bar:
//             { options: {},
//               files:
//                [ { taskname: 'lint',
//                    targetname: 'bar',
//                    options: {},
//                    src: [ 'index.js' ] } ] } },
//         taskname: 'lint' } } }



var config = new Config({
  options: {process: true},
  source: {
    site: 'src/site',
  },
  assemble: {
    cwd: 'foo',
    site: {
      options: { process: 'config' },
      xyz: 'yyy',
      abc: '<%= options.cwd %>/',
      src: 'test/fixtures/*.js'
    },
    blog: {
      src: 'test/fixtures/*.txt'
    }
  }
});
console.log(inspect(config));
