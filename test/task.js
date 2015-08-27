'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var utils = require('../lib/utils');
var Task = require('../lib/task');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('tasks', function () {
  describe('constructor', function () {
    it('should set a task `taskname` when passed as the first arg.', function () {
      var task = new Task('foo', {src: 'a', dest: 'b'});
      assert.equal(task.taskname, 'foo');
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

    it('should separate task options from targets:', function () {
      var task = new Task({
        options: {cwd: 'foo'},
        ext: '.bar',
        cwd: 'foo',
        one: {cwd: 'bar'},
        two: {cwd: 'baz'},
      });

      assert.deepEqual(task, {
        taskname: 'task_0',
        options: {cwd: 'foo', ext: '.bar'},
        targets: {
          one: {options: {cwd: 'bar', ext: '.bar' }, files: []},
          two: {options: {cwd: 'baz', ext: '.bar' }, files: []}
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

    it('should not overwrite existing task.options with config options.', function () {
      var task = {options: {foo: 'bar'}};
      var task = new Task({
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, task);
      task.should.have.property('options');
      task.options.should.have.property('foo', 'baz');
    });
  });
});
