'use strict';

var reserved = require('./lib/reserved');
var utils = require('./lib/utils');
var Task = require('./lib/task');
var Target = require('./lib/target');

var taskKeys = ['options', 'taskname'];
var targetKeys = ['targetname', 'files', 'src', 'dest', 'options'];

var optsKeys = [
  'base',
  'cwd',
  'destBase',
  'expand',
  'ext',
  'extDot',
  'extend',
  'flatten',
  'rename',
  'process',
  'srcBase'
];

var rootKeys = [
  'options',
  'files'
];

var filesKeys = [
  'src',
  'dest'
];

var methods = [
  'get',
  'set',
  'option',
  'visit',
  'validate'
];

var props = [
  'options',
  'deps',
  'pipeline',
  'run'
];


function Node(name, config, parent) {
  if (!(this instanceof Node)) {
    return new Node(name, config, parent);
  }

  this.rootKeys = rootKeys;
  this.reserved = ['a', 'b', 'c'];

  config = config || {};
  utils.define(this, 'orig', utils.clone(config));

  this.nodes = {};
  this.options = config.options || {};
  this.config = this.normalize(config);

  // if (utils.hasValues(config, this.rootKeys)) {
  //   this.addNode(config.name, config);
  // } else {
  //   utils.visit(this, 'addNode', config);
  // }
}

Node.prototype = {
  constructor: Node,

  normalize: function (config) {
    var root = utils.pick(config, rootKeys);
    var rest = utils.omit(config, rootKeys);

    return root;
  },

  addNode: function (name, config) {
    if (this.reserved.indexOf(name) < 0) {
      this.nodes[name] = this.createNode(name, config);
    }
    return this;
  },

  createNode: function (name, config) {
    if (typeof name === 'string') {
      this.validate(name);
    }

    // if it's not a child node, just add it to the root
    if (!isChild(name, config)) {
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
    return new Node(name, config, this);
  },

  validate: function (name) {
    if (~this.reserved.indexOf(name)) {
      throw new Error(name + ' is a reserved root-level property.');
    }
  },

  set: function (prop, value) {
    utils.set(this, prop, value);
    return this;
  },

  get: function (prop) {
    return utils.get(this, prop);
  }
};

function isTargetKey(key) {
  return ~targetKeys.indexOf(key);
}

function isTarget(name, value) {
  if (isTargetKey(name)) {
    return true;
  }
  for (var key in value) {
    if (typeof value === 'object' && isTarget(key, value[key])) {
      return true;
    }
  }
  return false;
}

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

function isChild(name, obj) {
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
 * Expose `Node`
 */

module.exports = Node;

/**
 * Expose `Task`
 */

module.exports.Task = Task;

/**
 * Expose `Target`
 */

module.exports.Target = Target;
