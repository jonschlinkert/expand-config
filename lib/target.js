'use strict';

var clone = require('clone-deep');
var Node = require('./lib/node');
var methods = require('../target');
var utils = require('../utils2');

function Target(name, config, parent) {
  Node.call(this, null, parent);
  this.define('orig', clone(config));
  if (parent) {
    if (parent.task || parent.name) {
      this.task = parent.task || parent.name;
    }
  }
  this.target = name;
  this.normalize(config);
}

Node.extend(Target);

Target.prototype.normalize = function(config) {
  config = methods.normalizeOpts('target', this)(config);
  config = methods.normalizeFiles(config);
  config = methods.expandFiles(this)(config);

  for (var key in config) {
    var val = config[key];
    if (utils.isNode(val, key)) {
      this.set(key, new Node(val, this));
    } else {
      this.set(key, val);
    }
  }
};

/**
 * Expose `Target`
 */

module.exports = Target;
