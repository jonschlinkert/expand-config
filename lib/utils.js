'use strict';

var typeOf = require('kind-of');
var expand = require('expand');
var clone = require('clone-deep');
var merge = require('mixin-deep');
var glob = require('globby');
var pick = require('object.pick');

/**
 * Expose `utils`
 */

var utils = module.exports;

var taskKeys = [
  'options',
  'taskname'
];

var targetKeys = [
  'targetname',
  'files',
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

function omit(o, keys) {
  var res = {};
  for (var key in o) {
    if (o.hasOwnProperty(key) && !contains(keys, key)) {
      res[key] = o[key];
    }
  }
  return res;
}

function some(o, cb, thisArg) {
  var res = false;
  forOwn(o, function (val, key) {
    if (cb(val, key, o)) {
      res = true;
      return false;
    }
  }, thisArg);
  return res;
}


function forOwn(o, fn, thisArg) {
  forIn(o, function (val, key) {
    if (o.hasOwnProperty(key)) {
      return fn.call(thisArg, o[key], key, o);
    }
  });
}

function forIn(o, fn, thisArg) {
  for (var key in o) {
    if (fn.call(thisArg, o[key], key, o) === false) {
      break;
    }
  }
}

function isString(val) {
  return is(val, 'string');
}

function isObject(val) {
  return is(val, 'object');
}

function is(val, type) {
  return typeOf(val) === type;
}

function unixify(fp) {
  return fp.split('\\').join('/');
}

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

function contains(o, val) {
  return some(o, equals(val));
}

function equals(a) {
  return function (b) {
    return a === b;
  };
}

function has(value, key) {
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
      if (has(value, val)) return true;
    }
    return false;
  }
}

function hasValues(obj, keys) {
  var res = pick(obj, keys);
  if (!!Object.keys(res).length) {
    return res;
  }
  return null;
}

function isTaskKey(key) {
  return has(taskKeys, key) && !isTargetKey(key);
}

function isTargetKey(key) {
  return has(targetKeys, key);
}

function isOptionsKey(key) {
  return has(optsKeys, key);
}

function isTask(val, key) {
  if (!isObject(val) || isTarget(val, key)) {
    return false;
  }
  for (var k in val) {
    if (isTaskKey(k)) return true;

    // if the value looks like a target, we're in a task
    if (has(val[k], targetKeys)) {
      return true;
    }
  }
  return false;
}

function isTarget(val, key) {
  if (key && isTargetKey(key)) {
    return true;
  }
  if (!isObject(val)) return false;
  if (has(val, targetKeys)) {
    return true;
  }
  return false;
}

function isNode(val, key) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && key !== 'options';
}

function replaceExt(fp, options) {
  var opts = merge({extDot: 'first'}, options);
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  return fp.replace(re[opts.extDot], opts.ext);
}

utils.arrayify = arrayify;
utils.clone = clone;
utils.contains = contains;
utils.equals = equals;
utils.expand = expand;
utils.forIn = forIn;
utils.glob = glob;
utils.has = has;
utils.hasValues = hasValues;
utils.is = is;
utils.isNode = isNode;
utils.isTarget = isTarget;
utils.isTargetKey = isTargetKey;
utils.isTask = isTask;
utils.isTaskKey = isTaskKey;
utils.merge = merge;
utils.omit = omit;
utils.pick = pick;
utils.replaceExt = replaceExt;
utils.some = some;
utils.unixify = unixify;
