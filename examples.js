'use strict';

var util = require('util');
var Config = require('./');

var inspect = function (obj) {
  return util.inspect(obj, null, 10);
};

var obj = {
  config: {
    base: {
      dest: 'FFFF'
    }
  },
  options: {
    process: true
  },
  a: {
    dest: '_gh_pages'
  },
  b: {
    bb: {
      dest: '_gh_pages'
    }
  },
  verb: {
    expand: true,
    ext: '.min.foo',
    extDot: 'first',
    // extend: true,
    readme: {
      expand: true,
      ext: '.min.foo',
      extDot: 'first',
      // extend: true,
      process: true,
      options: {e: 'f', x: 'y'},
      pipeline: [],
      src: '<%= assemble.site.src %>',
      dest: 'bar/',
      run: function() {},
    },
    docs: {
      deps: [],
      run: function() {},
      options: {hhh: 'iii', expand: true},
      pipeline: [],
      files: [
        {src: 'test/fixtures/a/*.*', dest: '<%= config.base.dest %>/b', options: {}},
        {src: 'test/fixtures/b/*.*', dest: '<%= config.base.dest %>/d'},
        {src: 'test/fixtures/c/*.*', dest: '<%= config.base.dest %>/f', options: {}},
      ]
    }
  },
  assemble: {
    options: {a: 'b'},
    pipeline: [],
    faux: {
      options: {},
      pipeline: []
    },
    site: {
      options: {c: 'd'},
      pipeline: [],
      src: 'test/fixtures/*.txt',
      dest: 'abc/'
    },
    whatever: {
      options: {foo: 'bar'},
      files: [
        {
          expand: true,
          cwd: 'test/fixtures/',
          src: ['*.js'],
          dest: 'build/',
          ext: '.min.js',
          extDot: 'first'
        },
        {
          expand: true,
          cwd: 'test/fixtures/',
          src: ['*.js'],
          dest: 'build/',
          ext: '.min.js',
          extDot: 'first'
        }
      ]
    },
    blog: {
      deps: [],
      flow: 'series',
      options: {e: 'f', x: 'y'},
      pipeline: [],
      expand: true,
      ext: '.min.foo',
      extDot: 'first',
      // extend: true,
      files: {
        options: {e: 'g'},
        src: '<%= assemble.site.src %>',
        dest: 'bar/'
      },
      run: function() {},
    },
    docs: {
      deps: [],
      run: function() {},
      process: 'all',
      options: {h: 'i', expand: true},
      pipeline: [],
      foo: '<%= bar %>',
      fez: '<%= docs.bar %>',
      qux: '<%= assemble.docs.bar %>',
      bar: 'baz',
      files: [
        {src: 'test/fixtures/a/*.txt', dest: 'b'},
        {src: 'test/fixtures/b/*.js', dest: 'd'},
        {src: 'c/*.coffee', dest: 'f', cwd: 'fixtures/files'},
      ]
    }
  }
};

// var obj = {
//   verb: {
//     expand: true,
//     ext: '.min.foo',
//     extDot: 'first',
//     extend: true,
//     readme: {
//       expand: true,
//       ext: '.min.foo',
//       extDot: 'first',
//       // TODO: test extend
//       // extend: true,
//       process: true,
//       options: {e: 'f', x: 'y'},
//       pipeline: [],
//       src: '<%= assemble.site.src %>',
//       dest: 'bar/',
//       run: function() {},
//     },
//     // docs: {
//     //   deps: [],
//     //   run: function() {},
//     //   options: {hhh: 'iii', expand: true},
//     //   pipeline: [],
//     //   files: [
//     //     {src: 'test/fixtures/a/*.*', dest: '<%= config.base.dest %>/b', options: {}},
//     //     {src: 'test/fixtures/b/*.*', dest: '<%= config.base.dest %>/d'},
//     //     {src: 'test/fixtures/c/*.*', dest: '<%= config.base.dest %>/f', options: {}},
//     //   ]
//     // }
//   },
//   assemble: {
//     site: {
//       src: 'test/fixtures/*.txt'
//     }
//   }
// }

// var obj = {
//   pattern: '*.json',
//   z: 'zzz',
//   assemble: {
//     pattern: '*.md',
//     x: 'xxx',
//     whatever: {
//       pattern: '.*.yml',
//       options: {foo: 'bar', expand: true, b: 'bbb'},
//       a: 'aaa',
//       src: '*.md',
//       dest: 'foo',
//       files: [
//         {
//           process: 'node',
//           expand: true,
//           rename: function (dest, fp) {
//             return 'foo/' + dest + fp;
//           },
//           pattern: '*.js',
//           // cwd: 'test/fixtures/',
//           src: ['<%= pattern %>', '<%= pattern %>'],
//           dest: 'build/'
//         },
//         {
//           process: 'task',
//           expand: true,
//           rename: function (dest, fp) {
//             return 'bar/' + dest + fp;
//           },
//           prop: '<%= a %>',
//           cwd: 'test/fixtures/',
//           src: ['<%= pattern %>'],
//           dest: 'build/'
//         }
//       ]
//     }
//   }
// };

var config = new Config('root', obj);
console.log(config);
