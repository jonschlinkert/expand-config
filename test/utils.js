'use strict';

/* deps: mocha */
var util = require('util');
var assert = require('assert');
var utils = require('../lib/utils');
var Target = require('../lib/target');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('utils', function () {
  describe('contains', function () {
    it('should return true if an array contains the given value:', function () {
      assert(utils.contains(['a', 'b', 'c'], 'a'));
    });

    it('should return false if an array does not contain the given value:', function () {
      assert(!utils.contains(['a', 'b', 'c'], 'f'));
    });
  });
});
