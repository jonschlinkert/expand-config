'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var Task = require('expand-task');
var utils = require('../lib/utils');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('tasks', function () {
  describe('constructor', function () {
    it('should set a task `name` when passed as the first arg.', function () {
      var task = new Task('foo', {src: 'a', dest: 'b'});
      assert.equal(task.name, 'foo');
    });

    it('should add a parent property if parent is passed:', function () {
      var task = new Task('foo', {}, {});
      assert.deepEqual(task.parent, {});
    });

    it('should add multiple targets if passed on the constructor:', function () {
      var task = new Task({
        foo: {src: 'test/fixtures/*.txt'},
        bar: {src: 'test/fixtures/*.txt'}
      });
      task.targets.should.have.properties('foo', 'bar');
    });
  });

  describe('options', function () {
    it('should move reserved options properties to `options`', function () {
      var task = new Task({cwd: 'foo'});
      assert.deepEqual(task.options, {cwd: 'foo'});
    });

    it('should merge reserved options properties with `options`', function () {
      var task = new Task({options: {cwd: 'foo'}, ext: '.bar'});
      assert.deepEqual(task.options, {cwd: 'foo', ext: '.bar'});
    });

    it('should add a non-enumerable `target` name to the target:', function () {
      var task = new Task('jshint', {
        options: {cwd: 'foo'},
        ext: '.bar',
        cwd: 'foo',
        one: {cwd: 'bar', src: '*.js'}
      });
      task.targets.one.target.should.equal('one');
    });

    it('should separate task options from targets:', function () {
      var task = new Task('jshint', {
        options: {cwd: 'foo'},
        ext: '.bar',
        cwd: 'foo',
        one: {cwd: 'bar', src: '*.js'},
        two: {cwd: 'baz', src: '*.js'},
      });

      assert.deepEqual(task, {
        options: {cwd: 'foo', ext: '.bar'},
        targets: {
          one: {
            options: {cwd: 'bar', ext: '.bar' },
            files: [{
              task: 'jshint',
              target: 'one',
              src: [],
              options: {cwd: 'foo', ext: '.bar' }
            }]
          },
          two: {
            options: {cwd: 'baz', ext: '.bar' },
            files: [{
              task: 'jshint',
              target: 'two',
              src: [],
              options: {cwd: 'foo', ext: '.bar' }
            }]
          }
        }
      });
    });
  });

  describe('parent', function () {
    it('should extend task.options with config options.', function () {
      var config = {options: {foo: 'bar'}};
      var task = new Task({src: 'a', dest: 'b'}, config);
      task.should.have.property('options');
      task.options.should.have.property('foo', 'bar');
    });

    it('should not overwrite target.options:', function () {
      var config = {options: {aaa: 'zzz'}};
      var task = new Task('assemble', {
        site: {
          options: {aaa: 'bbb'},
          src: 'a',
          dest: 'b',
        }
      }, config);

      task.should.have.property('options');
      task.options.should.have.property('aaa', 'zzz');
      task.targets.site.options.should.have.property('aaa', 'bbb');
    });

    it('should not overwrite options on created targets:', function () {
      var config = {options: {foo: 'bar'}};
      var task = new Task('assemble', {
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, config);

      task.should.have.property('name');
      task.should.have.property('options');
      task.options.should.have.property('foo', 'bar');
    });

    it('should auto-generate target names for anonymous targets:', function () {
      var config = {options: {foo: 'bar'}};
      var task = new Task('assemble', {
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, config);

      var keys = Object.keys(task.targets);
      keys[0].should.match(/assemble\d/);
      task.targets[keys[0]].options.should.have.property('foo', 'baz');
    });
  });
});
