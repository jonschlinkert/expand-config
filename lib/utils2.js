'use strict';

var typeOf = require('kind-of');

var utils = module.exports;

var taskKeys = ['options', 'taskname'];
var targetKeys = ['targetname', 'files', 'src', 'dest'];

var rootKeys = [
  'options',
  'files'
];

var filesKeys = [
  'src',
  'dest'
];

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

utils.isTaskKey = function isTaskKey(key) {
  return utils.has(taskKeys, key) && !utils.isTargetKey(key);
};

utils.isTargetKey = function isTargetKey(key) {
  return utils.has(targetKeys, key);
};

utils.isOptionsKey = function isOptionsKey(key) {
  return utils.has(optsKeys, key);
};

utils.isTask = function isTask(val, key) {
  if (!isObject(val) || utils.isTarget(val, key)) {
    return false;
  }
  for (var key in val) {
    if (utils.isTaskKey(key)) return true;

    // if the value looks like a target, we're in a task
    if (utils.has(val[key], targetKeys)) {
      return true;
    }
  }
  return false;
};

utils.isTarget = function isTarget(val, key) {
  if (key && utils.isTargetKey(key)) {
    return true;
  }
  if (!isObject(val)) return false;
  if (utils.has(val, targetKeys)) {
    return true;
  }
  return false;
};

utils.isNode = function isNode(val, key) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && key !== 'options';
};

function isString(val) {
  return typeof val === 'string';
}
function isObject(val) {
  return typeOf(val) === 'object';
}
