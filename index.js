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

function verify(name, obj) {
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

Config.prototype = {
  constructor: Config,

  addTask: function (name, config) {
    if (name) this.validate(name);

    // if it's not a task, just add it to the root
    // and return
    var checkProps = verify(name, config);
    if (!checkProps) {
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

    var task = new Task(name, config, this);
    utils.set(this.tasks, name, task);
    return this;
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
