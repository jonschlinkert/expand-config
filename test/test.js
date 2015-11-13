'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Config = require('..');
var config;

describe('configs', function () {
  beforeEach(function() {
    config = new Config();
  });

  describe('tasks', function () {
    it('should expose an "options" property', function () {
      config.expand({});
      assert(config.options);
    });

    it('should expose targets', function () {
      config.expand({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(config.targets.foo);
      assert(config.targets.bar);
    });

    it('should expose tasks', function () {
      config.expand({
        foo: {a: {src: '*'}},
        bar: {b: {src: '*'}}
      });
      assert(config.tasks.foo);
      assert(config.tasks.bar);
    });
  });
});
