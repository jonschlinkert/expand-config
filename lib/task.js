'use strict';

var _ = require('lodash');
var Target = require('./target');
var reserved = require('./reserved');
var utils = require('./utils');
var id = 0;

function Task(name, config, parent) {
  if (!(this instanceof Task)) {
    return new Task(name, config, parent);
  }

  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = null;
  }

  if (typeof parent === 'object') {
    utils.define(this, 'parent', parent);
  }

  if (typeof config !== 'object') {
    config = {};
  }

  utils.define(this, 'id', 0);
  this.taskname = typeof name !== 'string'
    ? 'task_' + (this.id++)
    : name;

  utils.define(this, 'orig', utils.clone(config));
  config = this.normalize(config);
  this.options = config.options || {};
  this.targets = {};

  if (utils.hasValues(config, ['files', 'src', 'dest'])) {
    this.addTarget(name, config, this);
  } else {
    utils.visit(this, 'addTarget', config);
  }
  return this;
}

Task.prototype = {
  constructor: Task,

  normalize: function(config) {
    config.options = config.options || {};

    var opts = utils.pick(config, reserved.opts);
    config = utils.omit(config, reserved.opts);
    config.options = utils.merge({}, config.options, opts);

    if (this.parent && this.parent.options) {
      config.options = utils.merge({}, this.parent.options, config.options);
    }

    // configolve templates using the `task` object as context
    var process = config.options.process;
    if (process === 'task' || process === true) {
      var ctx = utils.merge({}, this.orig, config);
      config = utils.expand(config, ctx);
    }
    return config;
  },

  addTarget: function (name, config) {
    if (reserved.all.indexOf(name) < 0) {
      this.targets[name] = this.createTarget(name, config);
    }
    return this;
  },

  createTarget: function (name, config) {
    if (typeof name !== 'string') {
      name = config.targetName || 'id_' + this.id++;
    }

    if (name === 'options') {
      utils.extend(this.options, config);
      return this;
    }

    if (~reserved.opts.indexOf(name)) {
      utils.set(this.options, name, config);
      return this;
    }

    this.validate(name);

    // resolve templates using the `task` object as context
    var process = this.options.process;
    if (process === 'task' || process === true) {
      var ctx = utils.merge({}, this.orig, config);
      config = utils.expand(config, ctx);
    }

    var target = new Target(name, config, this);
    return target.config;
  },

  set: function (prop, value) {
    utils.set(this, prop, value);
    return this;
  },

  validate: function (targetName) {
    if (~reserved.methods.indexOf(targetName)) {
      throw new Error(targetName + ' is a reserved task-level property.');
    }
  }
};

/**
 * Expose `Task`
 */

module.exports = Task;
