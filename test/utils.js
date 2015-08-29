'use strict';

/* deps: mocha */
var util = require('util');
var assert = require('assert');
var utils = require('../lib/utils');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('utils', function () {
  describe('.has', function () {
    it('should return true if an array has the given value:', function () {
      assert(utils.has(['a', 'b', 'c'], 'a'));
    });
    it('should return true if an object has the given key:', function () {
      assert(utils.has({a: 'b'}, 'a'));
      assert(!utils.has({a: 'b'}, 'c'));
    });
  });
});
