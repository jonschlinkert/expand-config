'use strict';

var reserved = require('./lib/reserved');
var utils = require('./lib/utils');
var Task = require('./lib/task');
var Target = require('./lib/target');

function Config(config) {
  if (!(this instanceof Config)) {
    return new Config(config);
  }

  config = config || {};
  utils.define(this, 'orig', utils.clone(config));
  this.options = config.options || {};
  this.tasks = {};

  if (utils.hasValues(config, ['files', 'src', 'dest'])) {
    this.addTask(config.taskname, config);
  } else {
    utils.visit(this, 'addTask', config);
  }
}

Config.prototype = {
  constructor: Config,

  addTask: function (name, config) {
    if (reserved.all.indexOf(name) < 0) {
      this.tasks[name] = this.createTask(name, config);
    }
    return this;
  },

  createTask: function (name, config) {
    if (typeof name === 'string') {
      this.validate(name);
    }

    // if it's not a task, just add it to the root
    if (!isTask(name, config)) {
      this.set(name, config);
      return this;
    }

    if (name === 'options') {
      this.options = utils.extend({}, config, this.options);
      return this;
    }

    if (~reserved.opts.indexOf(name)) {
      utils.set(this.options, name, config);
      return this;
    }

    // resolve config templates after options are set
    if (this.options.process === true) {
      config = utils.expand(config, utils.extend({}, this.orig, config));
    }
    return new Task(name, config, this);
  },

  set: function (prop, value) {
    utils.set(this, prop, value);
    return this;
  },

  get: function (prop) {
    return utils.get(this, prop);
  },

  validate: function (name) {
    if (~reserved.methods.indexOf(name)) {
      throw new Error(name + ' is a reserved root-level property.');
    }
  }
};

function isTask(name, obj) {
  var keys = ['files', 'src', 'dest', 'options'];
  if (utils.contains(keys, name)) {
    return true;
  }
  for (var key in obj) {
    if (utils.contains(keys, key)) {
      return true;
    }
    if (utils.hasValues(obj[key], keys)) {
      return true;
    }
  }
  return false;
}

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
