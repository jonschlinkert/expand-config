'use strict';

var clone = require('clone-deep');
var Node = require('./node');
var methods = require('./methods');
var Target = require('./target');
var utils = require('./utils');

function Task(name, config, parent) {
  Node.call(this, null, parent);
  this.define('orig', clone(config));
  this.task = name;
  this.options = {};
  this.targets = {};
  this.normalize(config);
}

Node.extend(Task);

Task.prototype.normalize = function(config) {
  config = methods.normalizeOpts('task', this)(config);
  for (var key in config) {
    var val = config[key];

    if (utils.isTarget(val, key)) {
      this.targets[key] = new Target(key, val, this);
    } else if (utils.isNode(val, key)) {
      this.set(key, new Node(val, this));
    } else {
      this.set(key, val);
    }
  }
};

/**
 * Expose `Task`
 */

module.exports = Task;
