'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var Mapping = require('expand-files');
var utils = require('../lib/utils');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('files', function () {
  describe('expand', function () {
    it('should create a node when no `src` exists', function () {
      var actual = new Mapping({foo: 'bar'});
      assert.deepEqual(actual, [{
        options: {},
        dest: 'foo',
        src: []
      }]);
    });

    it('should arrayify the `src` property', function () {
      var actual = new Mapping({src: 'a', dest: 'b'});
      actual[0].should.have.property('src');
      assert(Array.isArray(actual[0].src));
    });

    it('should expand `src` glob patterns:', function () {
      var actual = new Mapping({src: 'test/fixtures/*.txt'});
      assert.deepEqual(actual[0].src[0], 'test/fixtures/a.txt');
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      var actual = new Mapping({src: '*.txt', options: {cwd: 'test/fixtures'}});
      assert.equal(actual[0].src[0], 'a.txt');
      assert.equal(actual[0].src[1], 'b.txt');
      assert.equal(actual[0].src[2], 'c.txt');
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

  describe('files objects:', function () {
    var expected = [
      {src: ['test/fixtures/a.txt'], dest: 'foo/test/fixtures/a.txt'},
      {src: ['test/fixtures/b.txt'], dest: 'foo/test/fixtures/b.txt'},
      {src: ['test/fixtures/c.txt'], dest: 'foo/test/fixtures/c.txt'},
      {src: ['test/fixtures/d.txt'], dest: 'foo/test/fixtures/d.txt'},
      {src: ['test/fixtures/a.txt'], dest: 'bar/test/fixtures/a.txt'},
      {src: ['test/fixtures/b.txt'], dest: 'bar/test/fixtures/b.txt'},
      {src: ['test/fixtures/c.txt'], dest: 'bar/test/fixtures/c.txt'},
      {src: ['test/fixtures/d.txt'], dest: 'bar/test/fixtures/d.txt'}
    ];

    it('should expand files objects when src is a string:', function () {
      var actual = new Mapping({
        options: {expand: true},
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      actual.should.eql(expected);
    });

    it('should expand files objects when expand is on options:', function () {
      var actual = new Mapping({
        options: {expand: true},
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      actual.should.eql(expected);
    });

    it('should expand files objects when expand is on the root:', function () {
      var actual = new Mapping({
        expand: true,
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      actual.should.eql(expected);
    });

    it('should expand files objects when `src` is an array:', function () {
      var actual = new Mapping({
        options: {expand: true},
        'foo/': ['test/fixtures/*.txt'],
        'bar/': ['test/fixtures/*.txt']
      });
      actual.should.eql(expected);
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
