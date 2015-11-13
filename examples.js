
var Config = require('./');

var tasks = {
  options: {
    cwd: 'test/fixtures'
  },

  assemble: {
    site: {
      mapDest: true,
      dest: 'dist/',
      src: '{.*,*.*}'
    },
    docs: {
      src: 'test/fixtures/*.js',
      dest: 'site/assets/'
    }
  },

  verb: {
    docs: {
      flatten: true,
      mapDest: true,
      files: [
        {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
        {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
      ]
    }
  },

  site: {
    files: [
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    ]
  },

  docs: {
    cwd: 'test/fixtures',
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },

  not_a_task: {
    cwd: 'test/fixtures',
    mapDest: true
  },

  blog: {
    cwd: 'test/fixtures',
    mapDest: true,
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },

  showcase: {
    options: {
      cwd: 'test/fixtures',
      mapDest: true,
    },
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },

  microsite: {
    mapDest: true,
    src: '*.txt'
  },

  js: {
    files: {
      'dist/': ['*.js'],
    }
  },

  css: {
    mapDest: true,
    files: {
      'dist/': ['*.css'],
    }
  }
};


/**
 * CONFIG
 */

// var config = new Config();
// config.use(function fn(val) {
//   // console.log(val._name);
//   return fn;
// });

// config.expand(tasks);
// console.log(config);


var foo = new Config({
  site: {
    mapDest: true,
    dest: 'dist/',
    src: '{.*,*.*}'
  },
  docs: {
    src: 'test/fixtures/*.js',
    dest: 'site/assets/'
  }
});

console.log(foo);

// var bar = new Config({
//   assemble: {
//     site: {
//       mapDest: true,
//       dest: 'dist/',
//       src: '{.*,*.*}'
//     },
//     docs: {
//       src: 'test/fixtures/*.js',
//       dest: 'site/assets/'
//     }
//   }
// });

// console.log(bar);


var baz = new Config({
  options: { mapDest: true },
  src: 'test/fixtures/*.js',
  dest: 'site/assets/'
});

baz.expand({
  options: { mapDest: true },
  src: 'test/fixtures/*.js',
  dest: 'site/assets/'
})

console.log(baz.targets);
