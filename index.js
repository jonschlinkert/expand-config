'use strict';

var clone = require('clone-deep');
var Base = require('app-base');
var Node = require('./lib/node');
var Target = require('./lib/target');
var Files = require('./lib/files');
var Task = require('./lib/task');
var utils = require('./lib/utils');

function Config(name, config) {
  Base.call(this);
  if (typeof name !== 'string') {
    config = name;
    name = 'root';
  }
  this.name = name;
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
