'use strict';

var clone = require('clone-deep');
var methods = require('./methods');
var Target = require('./target');
var utils = require('./utils');
var Node = require('./node');

function Task(name, config, parent) {
  this.define('id', 0);

  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = utils.nextId('task', this.id);
  }

  Node.call(this, null, parent);
  this.define('orig', config ? clone(config) : {});
  this.name = name;
  this.options = {};
  this.targets = {};
  this.normalize(config || {});
}

Node.extend(Task);

Task.prototype.normalize = function(config) {
  if (utils.isTarget(config)) {
    var target = {};
    target[utils.nextId(this.name, this.id)] = config;
    config = target;
  }

  config = methods.normalizeOpts('task', this)(config);

  utils.forIn(config, function (val, key) {
    if (utils.isTarget(val, key)) {
      this.targets[key] = new Target(key, val, this);
    } else if (utils.isNode(val, key)) {
      this.set(key, new Node(val, this));
    } else {
      this.set(key, val);
    }
  }, this);
};

/**
 * Expose `Task`
 */

module.exports = Task;
