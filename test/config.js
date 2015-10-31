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
    it('should add multiple targets if passed on the constructor:', function () {
      var config = new Config({
        foo: {src: 'test/fixtures/*.txt'}
      });
      config.targets.should.have.property('foo');
    });

    it('should add a target if passed on the constructor:', function () {
      var config = new Config({
        foo: {src: 'test/fixtures/*.txt'},
        bar: {src: 'test/fixtures/*.txt'}
      });
      config.targets.should.have.properties('foo', 'bar');
    });

    it('should add a task if passed on the constructor:', function () {
      var config = new Config({
        foo: {
          one: {src: 'test/fixtures/a/*'},
          two: {src: 'test/fixtures/b/*'}
        }
      });
      config.tasks.should.have.property('foo');
      config.tasks.foo.should.have.property('targets');
      config.tasks.foo.targets.should.have.properties(['one', 'two']);
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

      config.should.have.property('options');
      config.options.should.have.properties(['base', 'process']);
    });
  });

  describe('options.process', function () {
    it.skip('should expand config templates:', function () {
      var config = new Config({
        base: 'test/fixtures',
        options: {
          expand: true,
          process: true,
        },
        foo: {
          one: {src: '<%= base %>/a/*.txt'},
          two: {src: '<%= base %>/b/*.txt'}
        },
        bar: {
          one: {src: '<%= options.base %>/a/*.txt'},
          two: {src: '<%= options.base %>/b/*.txt'}
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
      files[0].src[0].should.equal('test/fixtures/a/a.txt');
    });
  });
});
