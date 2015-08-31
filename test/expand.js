'use strict';

var path = require('path');
var util = require('util');
var assert = require('assert');
var should = require('should');
var extend = require('extend-shallow');
var Mapping = require('expand-files');
var expand = require('expand');

var inspect = function (obj) {
  return util.inspect(obj, null, 10);
};

/**
 * Some of these unit tests are based on the tests in `grunt.file`
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

describe('expand mapping:', function () {
  var actual, expected;

  beforeEach(function (done) {
    this.cwd = process.cwd();
    process.chdir('test/fixtures');
    done();
  });

  afterEach(function (done) {
    process.chdir(this.cwd);
    done();
  });

  describe('trailing slash handling:', function () {
    it('`dest` should work with or without trailing slash:', function () {
      var expected = [{
        dest: 'dest/a/a.txt',
        src: ['a/a.txt']
      }, {
        dest: 'dest/a/aa/aa.txt',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/a/aa/aaa/aaa.txt',
        src: ['a/aa/aaa/aaa.txt']
      }, ];

      var withoutSlash = new Mapping({
        options: {expand: true},
        src: ['a/**/*.txt'],
        dest: 'dest'
      });
      var withSlash = new Mapping({
        options: {expand: true},
        src: ['a/**/*.txt'],
        dest: 'dest/'
      });
      assert.deepEqual(withSlash, expected);
      assert.deepEqual(withoutSlash, expected);
    });
  });

  describe('options.flatten:', function () {
    it('dest paths should be flattened pre-dest+fp join', function () {
      var expected = [{
        dest: 'dest/a.txt',
        src: ['a/a.txt']
      }, {
        dest: 'dest/aa.txt',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/aaa.txt',
        src: ['a/aa/aaa/aaa.txt']
      }, ];

      var actual = new Mapping({
        options: {
          expand: true,
          flatten: true
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assert.deepEqual(actual, expected);
    });
  });

  describe('options.ext:', function () {
    it('should add the specified extension:', function () {
      expected = [{
        dest: 'dest/a/a.foo',
        src: ['a/a.txt']
      }, {
        dest: 'dest/a/aa/aa.foo',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/a/aa/aaa/aaa.foo',
        src: ['a/aa/aaa/aaa.txt']
      }];

      var actual = new Mapping({
        options: {
          expand: true,
          ext: '.foo'
        },
        src: ['a/**/*.txt'],
        dest: 'dest',
      });
      assert.deepEqual(actual, expected);
    });

    it('should add the specified extension:', function () {
      expected = [{
        dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo',
        src: ['expand-mapping-ext/dir.ectory/file-no-extension']
      }, {
        dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.foo',
        src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']
      }, {
        dest: 'dest/expand-mapping-ext/file.foo',
        src: ['expand-mapping-ext/file.ext.ension']
      }, ];
      assert.deepEqual(new Mapping({
        options: {
          expand: true,
          ext: '.foo'
        },
        src: ['expand-mapping-ext/**/file*'],
        dest: 'dest',
      }), expected);
    });

    it('empty string extension should be added', function () {
      expected = [{
        dest: 'dest/a/a',
        src: ['a/a.txt']
      }, {
        dest: 'dest/a/aa/aa',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/a/aa/aaa/aaa',
        src: ['a/aa/aaa/aaa.txt']
      }, ];
      assert.deepEqual(new Mapping({
        options: {
          expand: true,
          ext: ''
        },
        src: ['a/**/*.txt'],
        dest: 'dest',
      }), expected);
    });
  });

  it('options.extDot:', function () {
    expected = [{
      dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo',
      src: ['expand-mapping-ext/dir.ectory/file-no-extension']
    }, {
      dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.foo',
      src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']
    }, {
      dest: 'dest/expand-mapping-ext/file.foo',
      src: ['expand-mapping-ext/file.ext.ension']
    }];

    actual = new Mapping({
      options: {
        expand: true,
        ext: '.foo',
        extDot: 'first'
      },
      src: ['expand-mapping-ext/**/file*'],
      dest: 'dest'
    });

    // 'extDot of `first` should replace everything after the first dot in the filename.'
    assert.deepEqual(actual, expected);

    actual = new Mapping({
      options: {
        expand: true,
        ext: '.foo',
        extDot: 'last'
      },
      src: ['expand-mapping-ext/**/file*'],
      dest: 'dest'
    });

    expected = [{
      dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo',
      src: ['expand-mapping-ext/dir.ectory/file-no-extension']
    }, {
      dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.foo',
      src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']
    }, {
      dest: 'dest/expand-mapping-ext/file.ext.foo',
      src: ['expand-mapping-ext/file.ext.ension']
    }];

    // 'extDot of `last` should replace everything after the last dot in the filename.'
    assert.deepEqual(actual, expected);
  });

  it('options.cwd:', function () {
    var actual = new Mapping({
      options: {
        expand: true,
        cwd: 'a'
      },
      src: ['**/*.txt'],
      dest: 'dest'
    });

    var expected = [{
      dest: 'dest/a.txt',
      src: ['a/a.txt']
    }, {
      dest: 'dest/aa/aa.txt',
      src: ['a/aa/aa.txt']
    }, {
      dest: 'dest/aa/aaa/aaa.txt',
      src: ['a/aa/aaa/aaa.txt']
    }];

    // 'cwd should be stripped from front of fp, pre-dest+fp join'
    assert.deepEqual(actual, expected);
  });

  it('options.rename:', function () {
    var actual = new Mapping({
      options: {
        expand: true,
        flatten: true,
        cwd: 'a',
        rename: function (dest, fp, options) {
          return path.join(dest, options.cwd, 'foo', fp);
        }
      },
      src: ['**/*.txt'],
      dest: 'dest'
    });

    var expected = [{
      dest: 'dest/a/foo/a.txt',
      src: ['a/a.txt']
    }, {
      dest: 'dest/a/foo/aa.txt',
      src: ['a/aa/aa.txt']
    }, {
      dest: 'dest/a/foo/aaa.txt',
      src: ['a/aa/aaa/aaa.txt']
    }];

    // 'custom rename function should be used to build dest, post-flatten'
    assert.deepEqual(actual, expected);
  });

  it('should expose target properties to rename function:', function () {
    var actual = new Mapping({
      options: {
        expand: true,
        filter: 'isFile',
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        },
        rename: function (dest, fp, options) {
          var pattern = options.permalink;
          var ctx = extend({}, this, options, {dest: dest});
          ctx.ext = ctx.extname;
          return expand(pattern, ctx, {regex: /:([(\w ),]+)/});
        }
      },
      src: ['**/*'],
      dest: 'foo/bar'
    });

  });

  it('should group source arrays by dest paths:', function () {
    var actual = new Mapping({
      options: {
        expand: true,
        flatten: true,
        cwd: '',
        rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
      },
      src: ['{a,b}/**/*'],
      dest: 'dest'
    });

    expected = [{
      src: ['a/a.txt', 'a/aa/aa.txt', 'a/aa/aaa/aaa.txt'],
      dest: 'dest/all.txt'
    }, {
      src: ['a/aa', 'a/aa/aaa'],
      dest: 'dest/all'
    }, {
      src: ['b/alpha.js', 'b/beta.js', 'b/gamma.js'],
      dest: 'dest/all.js'
    }];

    assert.deepEqual(actual, expected);
  });

  it('should filter by stat type (directories):', function () {
    var actual = new Mapping({
      options: {
        expand: true,
        flatten: true,
        filter: 'isDirectory',
        rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
      },
      src: ['{a,b}/**/*'],
      dest: 'dest'
    });

    expected = [{
      src: ['a/aa', 'a/aa/aaa'],
      dest: 'dest/all'
    }];

    assert.deepEqual(actual, expected);
  });

  it('should filter by stat type (files):', function () {
    var actual = new Mapping({
      options: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
      },
      src: ['{a,b}/**/*'],
      dest: 'dest'
    });

    expected = [{
      src: ['a/a.txt', 'a/aa/aa.txt', 'a/aa/aaa/aaa.txt'],
      dest: 'dest/all.txt'
    }, {
      src: ['b/alpha.js', 'b/beta.js', 'b/gamma.js'],
      dest: 'dest/all.js'
    }];

    assert.deepEqual(actual, expected);
  });

  it('should throw an error when the filter argument is invalid:', function () {
    (function () {
      var actual = new Mapping({
        options: {
          expand: true,
          filter: 'isFil'
        },
        src: ['{a,b}/**/*'],
        dest: 'dest'
      });
    }).should.throw('[options.filter] `isFil` is not a valid fs.lstat method name');
  });
});
