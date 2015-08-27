'use strict';

var clone = require('clone-deep');
var Base = require('app-base');
var Node = require('./lib/node');
var Task = require('./lib/task');
var Target = require('./lib/target');
var utils = require('./lib/utils2');

function Config(name, config) {
  Base.call(this);
  this.name = name;
  this.define('orig', clone(config || {}));
  this.config = {};
  this.tasks = {};
  this.targets = {};
  this.visit('create', config);
}

Base.extend(Config);

Config.prototype.create = function(key, config) {
  if (utils.isTask(config, key)) {
    this.tasks[key] = new Task(key, config, this);
  } else if (utils.isTarget(config, key)) {
    this.targets[key] = new Target(key, config, this);
  } else if (utils.isNode(config, key)) {
    this.config[key] = new Node(config, this);
  } else {
    this.config[key] = config;
  }
};

  // validate: function (name) {
  //   if (~reserved.methods.indexOf(name)) {
  //     throw new Error(name + ' is a reserved root-level property.');
  //   }
  // }

/**
 * Expose `Config`
 */

module.exports = Config;

/**
 * Expose `Task`
 */

module.exports.Task = Task;

/**
 * Expose `Target`
 */

module.exports.Target = Target;
