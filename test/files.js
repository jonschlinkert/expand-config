'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var utils = require('../lib/utils');
var Mapping = require('../lib/files');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('files', function () {
  describe('expand', function () {
    it('should return a node when no `src` exists', function () {
      var actual = new Mapping({foo: 'bar'});
      assert.deepEqual(actual, {foo: 'bar', options: {}});
    });

    it('should arrayify the `src` property', function () {
      var actual = new Mapping({src: 'a', dest: 'b'});
      actual.should.have.property('src');
      assert(Array.isArray(actual.src));
    });

    it('should expand `src` glob patterns:', function () {
      var actual = new Mapping({src: 'test/fixtures/*.txt'});
      assert(utils.contains(actual.src, 'test/fixtures/a.txt'));
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      var actual = new Mapping({src: '*.txt', options: {cwd: 'test/fixtures'}});
      assert(utils.contains(actual.src, 'a.txt'));
      assert(utils.contains(actual.src, 'b.txt'));
      assert(utils.contains(actual.src, 'c.txt'));
    });
  });

  describe('options.expand', function () {
    describe('when expand is true', function () {
      it('should join the `cwd` to expanded `src` paths:', function () {
        var actual = new Mapping({src: '*.txt', options: {cwd: 'test/fixtures', expand: true}});
        assert.deepEqual(actual[0].src, ['test/fixtures/a.txt']);
        assert.deepEqual(actual[1].src, ['test/fixtures/b.txt']);
        assert.deepEqual(actual[2].src, ['test/fixtures/c.txt']);
      });

      it('should expand `src` paths into src-dest mappings:', function () {
        var actual = new Mapping({
          src: 'test/fixtures/*.txt',
          options: {
            expand: true
          }
        });

        actual.should.containEql({
          src: [ 'test/fixtures/a.txt' ],
          dest: 'test/fixtures/a.txt'
        });
        actual.should.containEql({
          src: [ 'test/fixtures/b.txt' ],
          dest: 'test/fixtures/b.txt'
        });
      });

      it('should create `dest` properties using the src basename:', function () {
        var actual = new Mapping({
          options: {
            expand: true
          },
          src: 'test/fixtures/*.txt'
        });
        assert.equal(actual[0].dest, 'test/fixtures/a.txt');
      });

      it('should not prepend `cwd` to created `dest` mappings:', function () {
        var actual = new Mapping({
          options: {
            cwd: 'test/fixtures/',
            expand: true
          },
          src: '*.txt'
        });
        assert.equal(actual[0].dest, 'a.txt');
      });

      it('should expand `src` paths to src-dest mappings:', function () {
        var actual = new Mapping({
          src: '*.txt',
          options: {
            cwd: 'test/fixtures',
            expand: true
          }
        });

        actual.should.containEql({
          src: [ 'test/fixtures/a.txt' ],
          dest: 'a.txt'
        });
        actual.should.containEql({
          src: [ 'test/fixtures/b.txt' ],
          dest: 'b.txt'
        });
      });

    });
  });

  describe('options.flatten:', function () {
    it('should flatten dest paths:', function () {
      var actual = new Mapping({
        options: {
          expand: true,
          flatten: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      assert.deepEqual(actual, [
        {dest: 'dest/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ]);
    });

    it('should not flatten dest paths when flatten is false', function () {
      var actual = new Mapping({
        options: {
          expand: true,
          flatten: false
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      assert.deepEqual(actual, [
        {dest: 'dest/test/fixtures/a/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/test/fixtures/a/aa/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ]);
    });

    it('should not flatten dest paths when flatten is undefined:', function () {
      var actual = new Mapping({
        options: {
          expand: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      assert.deepEqual(actual, [
        {dest: 'dest/test/fixtures/a/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/test/fixtures/a/aa/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ]);
    });
  });
});
