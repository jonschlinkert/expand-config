'use strict';

var clone = require('clone-deep');
var get = require('get-value');
var Base = require('app-base');
var Target = require('expand-target');
var Files = require('expand-files');
var Task = require('expand-task');
var Node = require('./lib/node');
var utils = require('./lib/utils');

function Config(name, config) {
  if (!(this instanceof Config)) {
    return new Config(config);
  }
  Base.call(this);
  if (typeof name !== 'string') {
    config = name;
    name = 'root';
  }
  this.define('name', name);
  this.define('orig', clone(config || {}));
  this.options = {};
  this.config = {};
  this.tasks = {};
  this.targets = {};
  this.visit('create', config);
}

Base.extend(Config);

Config.prototype.create = function(key, config) {
  var type = utils.isType(config, key);

  switch(type) {
    case 'options':
      if (key === 'options') {
        utils.merge(this.options, config);
      } else {
        this.options[key] = config;
      }
      break;
    case 'task':
      this.tasks[key] = new Task(key, config, this);
      break;
    case 'target':
      this.targets[key] = new Target(key, config, this);
      break;
    case 'node':
      this.config[key] = new Node(config, this);
      break;
    default: {
      this.config[key] = config;
      break;
    }
  }
};

Config.prototype.getTask = function(name, target) {
  var task = get(this.tasks, name);
  if (!task) return null;
  return target ? task.getTarget(target) : task;
};

Config.prototype.toConfig = function() {
  var config = {};
  config.options = this.options;
  utils.merge(config, this.tasks);

  utils.forIn(config, function (val, key) {
    if (key !== 'options') {
      utils.merge(val, val.targets);
      delete val.targets;
    }
  });
  return config
};

/**
 * Expose `Config`
 */

module.exports = Config;

/**
 * Expose constructors
 */

module.exports.Task = Task;
module.exports.Target = Target;
module.exports.Files = Files;
module.exports.Node = Node;
