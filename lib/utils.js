'use strict';

var typeOf = require('kind-of');
var reserved = require('./reserved');
var cache = {};

/**
 * Expose `utils`
 * TODO: move to shared lib
 */

var utils = module.exports;

/**
 * Return the "type" of configuration
 *   | options
 *   | task
 *   | target
 *   | node
 *   | config
 */

utils.isType = function isType(config, key) {
  if (utils.isOptions(key)) {
    return 'options';
  }
  if (utils.isTask(config, key)) {
    return 'task';
  }
  if (utils.isTarget(config, key)) {
    return 'target';
  }
  if (utils.isNode(config, key)) {
    return 'node';
  }
  return 'config';
};

/**
 * Return true if a configuration looks like a task
 */

utils.isTask = function isTask(val, key) {
  if (!isObject(val) || utils.isTarget(val, key)) {
    return false;
  }
  for (var k in val) {
    if (utils.isTaskKey(k)) return true;

    // if the value looks like a target, we're in a task
    if (utils.has(val[k], reserved.targetKeys)) {
      return true;
    }
  }
  return false;
};

/**
 * Return true if a configuration looks like a target
 */

utils.isTarget = function isTarget(val, key) {
  if (key && utils.isTargetKey(key)) {
    return true;
  }
  if (!isObject(val)) return false;
  if (utils.has(val, reserved.targetKeys)) {
    return true;
  }
  return false;
};

/**
 * Return true if a configuration looks like a files node
 */

utils.isNode = function isNode(val, key) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && key !== 'options';
};

/**
 * Return true if a configuration looks like options
 */

utils.isOptions = function isOptions(key) {
  return key && (key === 'options' || utils.isOptionsKey(key));
};

/**
 * check keys
 */

utils.isTaskKey = function isTaskKey(key) {
  return utils.has(reserved.taskKeys, key) && !utils.isTargetKey(key);
};

utils.isTargetKey = function isTargetKey(key) {
  return utils.has(reserved.targetKeys, key);
};

utils.isOptionsKey = function isOptionsKey(key) {
  return utils.has(reserved.optsKeys, key);
};

/**
 * Generate sequentially incremented IDs for
 * un-named tasks and targets.
 *
 * @param {String} `key`
 * @return {String}
 */

utils.nextId = function nextId(key) {
  if (!cache.hasOwnProperty(key)) cache[key] = 0;
  return key + cache[key]++;
};

/**
 * Type utils
 */

utils.arrayify = function arrayify(val) {
  return Array.isArray(val) ? val : [val];
};

utils.has = function has(value, key) {
  if (typeof key === 'undefined') return false;
  if ((Array.isArray(value) || isString(value)) && isString(key)) {
    return value.indexOf(key) > -1;
  }
  if (isObject(value) && isString(key)) {
    return key in value;
  }
  if (typeof value === 'object' && Array.isArray(key)) {
    var len = key.length;
    while (len--) {
      var val = key[len];
      if (utils.has(value, val)) return true;
    }
    return false;
  }
};

function isObject(val) {
  return typeOf(val) === 'object';
}

function isString(val) {
  return typeOf(val) === 'string';
}

