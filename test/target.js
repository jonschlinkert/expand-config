'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var utils = require('../lib/utils');
var Target = require('../lib/target');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('targets', function () {
  describe('constructor', function () {
    it('should set a target `name` when passed as the first arg.', function () {
      var target = new Target('foo', {src: 'a', dest: 'b'});
      assert.equal(target.targetname, 'foo');
    });

    it('should add a parent property if parent is passed:', function () {
      var target = new Target('foo', {}, {});
      assert.deepEqual(target.parent, {});
    });

    it('should add a `task` property if passed on parent:', function () {
      var a = new Target({}, {taskname: 'jshint'});
      assert.equal(a.taskname, 'jshint');
      var b = new Target({}, {task: 'assemble'});
      assert.equal(b.taskname, 'assemble');
    });
  });

  describe('options', function () {
    it('should move `reserved` properties to `options`', function () {
      var target = new Target({cwd: 'foo'});
      assert.deepEqual(target.config, {options: {cwd: 'foo'}, files: []});
    });

    it('should not move non-reserved properties to `options`', function () {
      var target = new Target({foo: 'bar'});
      assert.deepEqual(target.config, {foo: 'bar', options: {}, files: []});
    });

    it('should extend node options with target options', function () {
      var target = new Target({options: {a: 'b'}, src: 'a', foo: 'bar'});

      target.config.should.have.property('options');
      target.config.options.should.have.property('a', 'b');
    });
  });

  describe('parent', function () {
    it('should extend target.options with task options.', function () {
      var task = {options: {foo: 'bar'}};
      var target = new Target({src: 'a', dest: 'b'}, task);
      target.config.should.have.property('options');
      target.config.options.should.have.property('foo', 'bar');
    });

    it('should not overwrite existing target.options with task options.', function () {
      var task = {options: {foo: 'bar'}};
      var target = new Target({
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, task);
      target.config.should.have.property('options');
      target.config.options.should.have.property('foo', 'baz');
    });
  });

  describe('files', function () {
    it('should move `src` and `dest` to files.', function () {
      var target = new Target('lint', {src: 'a', dest: 'b'});
      target.config.should.have.property('files');
      target.config.files[0].should.have.properties(['src', 'dest']);
      target.config.should.not.have.properties(['src', 'dest']);
    });

    it('should arrayify the `files` property', function () {
      var target = new Target({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(target.config.files));
    });

    it('should arrayify the `src` property', function () {
      var a = new Target({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(a.config.files[0].src));
    });

    it('should expand `src` glob patterns:', function () {
      var target = new Target({src: 'test/fixtures/*.txt'});
      assert(utils.contains(target.config.files[0].src, 'test/fixtures/a.txt'));
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      var target = new Target({src: '*.txt', cwd: 'test/fixtures'});
      assert(utils.contains(target.config.files[0].src, 'a.txt'));
      assert(utils.contains(target.config.files[0].src, 'b.txt'));
      assert(utils.contains(target.config.files[0].src, 'c.txt'));
    });
  });

  describe('options.extend', function () {
    it('should extend expanded nodes with target properties:', function () {
      var target = new Target('lib', {
        options: {aaa: 'bbb', cwd: 'test/fixtures/'},
        expand: true,
        extend: true,
        files: [
          {options: {aaa: 'ccc'}, src: '*.js', dest: 'b'},
          {options: {ddd: 'eee'}, src: '*.txt', dest: 'd'},
          {cwd: 'faux/', src: '*.txt', dest: 'd', foo: 'bar'},
        ]
      }, {taskname: 'jshint'});

      target.config.files[0].should.have.property('options');
      target.config.files[0].should.have.property('taskname', 'jshint');
      target.config.files[0].should.have.property('targetname', 'lib');
    });
  });

  describe('options.expand', function () {
    describe('when expand is true', function () {
      it('should join the `cwd` to expanded `src` paths:', function () {
        var target = new Target({src: '*.txt', cwd: 'test/fixtures', expand: true});
        assert(utils.contains(target.config.files[0].src, 'test/fixtures/a.txt'));
        assert(utils.contains(target.config.files[1].src, 'test/fixtures/b.txt'));
        assert(utils.contains(target.config.files[2].src, 'test/fixtures/c.txt'));
      });

      it('should create `dest` properties using the src basename:', function () {
        var target = new Target({src: 'test/fixtures/*.txt', expand: true});
        assert(utils.contains(target.config.files[0].dest, 'a.txt'));
      });

      it('should expand `src` paths to src-dest mappings:', function () {
        var target = new Target({src: 'test/fixtures/*.txt', expand: true});
        target.config.files.should.containEql({
          src: [ 'test/fixtures/a.txt' ],
          dest: 'test/fixtures/a.txt'
        });
        target.config.files.should.containEql({
          src: [ 'test/fixtures/b.txt' ],
          dest: 'test/fixtures/b.txt'
        });
      });

      it('should strip cwd from dest mappings:', function () {
        var target = new Target({src: '*.txt', cwd: 'test/fixtures', expand: true});
        target.config.files.should.containEql({
          src: [ 'test/fixtures/a.txt' ],
          dest: 'a.txt'
        });
        target.config.files.should.containEql({
          src: [ 'test/fixtures/b.txt' ],
          dest: 'b.txt'
        });
      });

      it('should expand `src-dest` mappings:', function () {
        var target = new Target({src: 'test/fixtures/*.txt'});
        assert(utils.contains(target.config.files[0].src, 'test/fixtures/a.txt'));
      });
    });
  });

  describe('target nodes', function () {
    describe('options.process', function () {
      it('should resolve templates in config values:', function () {
        var target = new Target({
          src: '*.txt',
          cwd: '<%= foo %>',
          process: true,
          expand: true,
          foo: 'test/fixtures'
        });

        // console.log(inspect(target))
        target.config.options.cwd.should.equal('test/fixtures');
      });
    });

    describe('options.process - target', function () {
      it('should resolve templates in config values:', function () {
        var target = new Target({
          src: '*.txt',
          cwd: '<%= foo %>',
          process: 'target',
          expand: true,
          foo: 'test/fixtures',
          bar: '<%= options.cwd %>',
          baz: '<%= cwd %>',
        });

        /**
         * should (just) work...
         */

        // on reserved properties that are moved to options
        target.config.options.cwd.should.equal('test/fixtures');

        // on templates for reserved properties that are moved to options
        target.config.bar.should.equal('test/fixtures');

        // on the `orig` value of reserved properties
        target.config.baz.should.equal('test/fixtures');
      });
    });
  });
});
