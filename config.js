
var util = require('util');
var clone = require('clone-deep');
var Base = require('app-base');
// var Node = require('./node');
var extend = require('extend-shallow');
var utils = require('./utils');
var methods = require('./target');

var inspect = function(obj) {
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

// var node = new Node(obj);
// console.log(node);

function Root(name, config) {
  Base.call(this);
  this.name = name;
  this.define('orig', clone(config || {}));
  this.config = {};
  this.tasks = {};
  this.targets = {};
  this.visit('create', config);
}
Base.extend(Root);

Root.prototype.create = function(key, config) {
  if (utils.isTask(config, key)) {
    this.tasks[key] = new Task(key, config, this);
  } else if (utils.isTarget(config, key)) {
    this.targets[key] = new Target(key, config, this);
  } else if (isNode(config, key)) {
    this.config[key] = new Node(config, this);
  } else {
    this.config[key] = config;
  }
};

function Node(config, parent) {
  Base.call(this, config);
  if (parent) {
    this.define('parent', {
      enumerable: false,
      get: function () {
        return parent;
      }
    });
  }
  this.define('root', {
    enumerable: false,
    get: function () {
      if (this.parent) {
        return this.parent.root || this.parent.orig;
      }
      return this.orig || this;
    }
  });
}

Base.extend(Node);

function Target(name, config, parent) {
  Node.call(this, null, parent);
  this.define('orig', clone(config));
  if (parent) {
    if (parent.task || parent.name) {
      this.task = parent.task || parent.name;
    }
  }
  this.target = name;
  this.normalize(config);
}
Node.extend(Target);

Target.prototype.normalize = function(config) {
  config = methods.normalizeOpts('target', this)(config);
  config = methods.normalizeFiles(config);
  config = methods.expandFiles(this)(config);

  for (var key in config) {
    var val = config[key];
    if (isNode(val, key)) {
      this.set(key, new Node(val, this));
    } else {
      this.set(key, val);
    }
  }
};

function Task(name, config, parent) {
  Node.call(this, null, parent);
  this.define('orig', clone(config));
  this.task = name;
  this.options = {};
  this.targets = {};
  this.normalize(config);
}
Node.extend(Task);

Task.prototype.normalize = function(config) {
  config = methods.normalizeOpts('task', this)(config);
  for (var key in config) {
    var val = config[key];

    if (utils.isTarget(val, key)) {
      this.targets[key] = new Target(key, val, this);
    } else if (isNode(val, key)) {
      this.set(key, new Node(val, this));
    } else {
      this.set(key, val);
    }
  }
};

function isNode(val, key) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && key !== 'options';
}

function createConfig(name, obj) {
  var root = new Root(name, obj);
  return root;
}

var config = createConfig('root', obj);


console.log(inspect(config));
