'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var Config = require('..');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('config', function () {
  describe('constructor', function () {
    it('should add multiple tasks if passed on the constructor:', function () {
      var config = new Config({
        foo: {src: 'test/fixtures/*.txt'},
        bar: {src: 'test/fixtures/*.txt'}
      });
      config.tasks.should.have.properties('foo', 'bar');
    });

    it('should add multiple tasks if passed on the constructor:', function () {
      var config = new Config({
        foo: {
          one: {src: 'test/fixtures/a/*'},
          two: {src: 'test/fixtures/b/*'}
        },
        bar: {
          one: {src: 'test/fixtures/a/*'},
          two: {src: 'test/fixtures/b/*'}
        }
      });
      config.tasks.should.have.properties('foo', 'bar');
    });
  });

  describe('options', function () {
    it('should move reserved options properties to options:', function () {
      var config = new Config({
        base: 'test/fixtures',
        process: true,
        foo: {
          one: {src: '<%= base %>/a/*'},
          two: {src: '<%= base %>/b/*'}
        }
      });
      config.tasks.should.have.properties('foo');
    });
  });

  describe('options.process', function () {
    it('should expand config templates:', function () {
      var config = new Config({
        base: 'test/fixtures',
        options: {
          expand: true,
          process: true,
        },
        foo: {
          one: {src: '<%= base %>/a/*'},
          two: {src: '<%= base %>/b/*'}
        },
        bar: {
          one: {src: '<%= base %>/a/*'},
          two: {src: '<%= base %>/b/*'}
        }
      });

      config.tasks.should.have.properties('foo', 'bar');
      config.tasks.foo.should.have.properties('options', 'targets');
      config.tasks.foo.targets.should.have.properties('one', 'two');
      config.tasks.foo.targets.one.should.have.property('files');

      var files = config.tasks.foo.targets.one.files;
      assert(Array.isArray(files));
      assert(files.length > 0);
      files[0].should.have.property('src');
      files[0].src.should.eql(['test/fixtures/a/a.txt']);
    });
  });
});
