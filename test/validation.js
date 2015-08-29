'use strict';

/* deps: mocha */
var util = require('util');
var assert = require('assert');
var utils = require('../lib/utils');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('utils', function () {
  describe('generic utils', function () {
    describe('has', function () {
      it('should return true if `a` has value `b`:', function () {
        assert(utils.has('foo', 'f'));
        assert(utils.has(['foo'], 'foo'));
        assert(utils.has(['foo', 'bar'], 'bar'));
        assert(utils.has(['a', 'b'], ['a']));
        assert(utils.has({a: 'b'}, ['a', 'b', 'c']));
        assert(utils.has({a: 'b'}, ['a']));
        assert(utils.has({a: 'b'}, 'a'));
      });

      it('should return false if value `a` does not have value `b`:', function () {
        assert(!utils.has({a: 'b'}, ['e', 'f']));
        assert(!utils.has({a: 'b'}, 'c'));
        assert(!utils.has(['a', 'b'], ['c']));
        assert(!utils.has(['foo'], 'f'));
        assert(!utils.has('foo'));
      });
    });
  });

  describe('target', function () {
    describe('isTargetKey', function () {
      it('should return false if a value does not look like a target:', function () {
        assert(!utils.isTarget('foo'));
        assert(!utils.isTarget('options'));
      });

      it('should return true if a value looks like a target:', function () {
        assert(utils.isTargetKey('src'));
        assert(utils.isTargetKey('files'));
        assert(utils.isTargetKey('dest'));
        assert(utils.isTargetKey('src'));
      });
    });

    describe('isTarget', function () {
      it('should return true if a value looks like a target:', function () {
        assert(utils.isTarget({options: {}, src: '', dest: ''}));
      });

      it('should return false if a value is not an object:', function () {
        assert(!utils.isTarget('foo'));
      });

      it('should return false if a value does not look like a target:', function () {
        assert(!utils.isTarget({foo: '', options: {}}));
      });
    });
  });

  describe('task', function () {
    describe('isTaskKey', function () {
      it('should return false if a value does not look like a task key:', function () {
        assert(!utils.isTaskKey('foo'));
        assert(!utils.isTaskKey('src'));
        assert(!utils.isTaskKey('files'));
        assert(!utils.isTaskKey('dest'));
        assert(!utils.isTaskKey('src'));
      });

      it('should return true if a value looks like a task key:', function () {
        assert(utils.isTaskKey('options'));
      });
    });

    describe('isTask', function () {
      it('should return false if a value does not look like a task:', function () {
        assert(!utils.isTask({options: {}, src: '', dest: ''}));
        assert(!utils.isTask({options: {}, dest: ''}));
        assert(!utils.isTask({src: ''}));
        assert(!utils.isTask({foo: {}}));
      });

      it('should return false if a value is not an object:', function () {
        assert(!utils.isTask('foo'));
      });

      it('should return true if a value looks like a task:', function () {
        assert(utils.isTask({options: {}}));
        assert(utils.isTask({foo: {src: ''}}));
      });
    });
  });
});
