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
      assert.equal(target.name, 'foo');
    });

    it('should add a parent property if parent is passed:', function () {
      var target = new Target('foo', {}, {});
      assert.deepEqual(target.parent, {});
    });

    it('should add a `taskname` property if passed on parent:', function () {
      var target = new Target('foo', {}, {taskname: 'jshint'});
      assert.equal(target.taskname, 'jshint');
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

      assert.deepEqual(target.config, {
        foo: 'bar',
        options: {a: 'b'},
        files: [{
          options: {a: 'b'},
          src: ['a'],
          foo: 'bar'
        }]
      });
    });
  });
  describe('files', function () {
    it('should move `src` and `dest` to files.', function () {
      var target = new Target('lint', {src: 'a', dest: 'b'});
      assert.deepEqual(target.config.files, [{name: 'lint', options: {}, src: ['a'], dest: 'b'}]);
    });

    it('should arrayify the `files` property', function () {
      var target = new Target({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(target.config.files));
      assert.deepEqual(target.config.files, [{options: {}, src: ['a'], dest: 'b'}]);
    });

    it('should arrayify the `src` property', function () {
      var a = new Target({files: {src: 'a', dest: 'b'}});
      assert.deepEqual(a.config.files[0].src, ['a']);

      var b = new Target({src: 'a', dest: 'b'});
      assert.deepEqual(b.config.files[0].src, ['a']);
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

    it.skip('should convert target nodes to a flattened array:', function () {
      var target = new Target('foo', {
        options: {aaa: 'bbb'},
        files: [
          {options: {aaa: 'ccc'}, src: 'a', dest: 'b'},
          {options: {ddd: 'eee'}, src: 'c', dest: 'd'},
        ]
      });
      // console.log(target)
      // assert.deepEqual(target.config.files, [{options: {}, src: ['a'], dest: 'b'}]);
    });

    it.skip('should convert target nodes to a flattened array:', function () {
      var target = new Target('foo', {
        options: {aaa: 'bbb', cwd: 'whatever'},
        expand: true,
        files: [
          {options: {aaa: 'ccc'}, src: 'test/fixtures/*.js', dest: 'b'},
          {options: {ddd: 'eee'}, src: 'test/fixtures/*.txt', dest: 'd'},
        ]
      });

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
});
