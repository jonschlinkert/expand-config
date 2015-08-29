'use strict';

var clone = require('clone-deep');
var get = require('get-value');
var Base = require('base-methods');
var forIn = require('for-in');
var merge = require('mixin-deep');
var Target = require('expand-target');
var Files = require('expand-files');
var Task = require('expand-task');
var Node = require('./lib/node');
var utils = require('./lib/utils');

/**
 * Expand a declarative configuration with tasks, targets and
 * files mappings, optionally passing a `name` to register.
 *
 * ```js
 * config('assemble', {
 *   site: {
 *     src: 'templates/*.hbs',
 *     dest: 'site/'
 *   },
 *   blog: {
 *     src: 'content/*.md',
 *     dest: 'site/blog/'
 *   }
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Object} `config`
 */

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
        merge(this.options, config);
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
 * Get a task by `name`
 *
 * ```js
 * config.getTask('jshint');
 * ```
 *
 * @param {String} `name`
 * @param {String} `target` Optionally specify the name of a target to get.
 * @return {Object} Returns a task or target object
 * @api public
 */

Config.prototype.getTask = function(name, target) {
  var task = get(this.tasks, name);
  if (!task) return null;
  return target ? task.getTarget(target) : task;
};

Config.prototype.toConfig = function() {
  var config = {};
  config.options = this.options;
  merge(config, this.tasks);

  forIn(config, function (val, key) {
    if (key !== 'options') {
      merge(val, val.targets);
      delete val.targets;
    }
  });
  return config;
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
