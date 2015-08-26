'use strict';

var Target = require('./target');
var reserved = require('./reserved');
var utils = require('./utils');

function Task(name, config, parent) {
  if (!(this instanceof Task)) {
    return new Task(name, config, parent);
  }

  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = null;
  }

  if (typeof config === 'string') {
    return config;
  }

  utils.define(this, 'ids', 0);
  config = config || {};
  this.options = config.options || {};
  this.targets = {};

  if (typeof parent === 'object') {
    utils.define(this, 'parent', parent);

    if (this.parent.options) {
      this.options = utils.merge({}, this.parent.options, this.options);
    }
  }

  if (typeof name === 'string') {
    this.taskname = name;
  } else if (typeof config.taskname === 'string') {
    this.taskname = config.taskname;
  }

  if (utils.hasValues(config, ['files', 'src', 'dest'])) {
    utils.visit(this, 'set', this.createTarget(name, config, this));
  } else {
    utils.visit(this, 'addTarget', config);
  }
}

Task.prototype = {
  constructor: Task,

  addTarget: function (targetName, config) {
    var target = this.createTarget(targetName, config);
    this.targets[targetName] = target;
    return this;
  },

  createTarget: function (targetName, config) {
    if (typeof targetName !== 'string') {
      targetName = config.targetName || 'id_' + this.ids++;
    }

    if (targetName === 'options') {
      utils.extend(this.options, config);
      return this;
    }

    if (~reserved.opts.indexOf(targetName)) {
      this.options[targetName] = config;
      return this;
    }

    this.validate(targetName);

    // resolve templates using the `task` object as context
    var process = this.options.process;
    if (process === 'task' || process === true) {
      config = utils.expand(config, utils.merge({}, this.orig, config));
    }
    return new Target(targetName, config, this).config;
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
