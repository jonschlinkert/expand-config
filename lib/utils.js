'use strict';

var iterator = require('make-iterator');
var path = require('path');

/**
 * Expose lazily required module dependecies as `utils` methods
 */

var lazy = module.exports = require('lazy-cache')(require);
var utils = lazy;
lazy('expand');
lazy('for-own');
lazy('globby', 'glob');
lazy('collection-visit', 'visit');
lazy('define-property', 'define');
lazy('extend-shallow', 'extend');
lazy('clone-deep', 'clone');
lazy('mixin-deep', 'merge');
lazy('kind-of', 'typeOf');
lazy('object.omit', 'omit');
lazy('object.pick', 'pick');
lazy('get-value', 'get');
lazy('set-value', 'set');
lazy('parse-filepath', 'parsePath');

utils.replaceExt = function replaceExt(fp, options) {
  var opts = utils.extend({extDot: 'first'}, options);
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  return fp.replace(re[opts.extDot], opts.ext);
};

utils.hasValues = function hasValues(obj, keys) {
  var res = utils.pick(obj, keys);
  if (!!Object.keys(res).length) {
    return res;
  }
  return null;
};

utils.unixify = function unixify(fp) {
  return fp.split('\\').join('/');
};

utils.arrayify = function arrayify(val) {
  return Array.isArray(val) ? val : [val];
};

utils.contains = function contains(arr, val) {
  return arr.indexOf(val) > -1;
};


function pick(o, props) {
  var keys = typeof props === 'string'
    ? [].slice.call(arguments, 1)
    : props;

  var res = {};
  var i = 0, key;

  while (key = keys[i++]) {
    res[key] = o[key];
  }
  return res;
}

function pluck(o, key){
  return map(o, prop(key));
}

function prop(key){
  return function(o){
    return o[key];
  };
}

function map(o, cb, thisArg) {
  cb = iterator(cb, thisArg);
  var res = {};

  forOwn(o, function (val, key, o) {
    res[key] = cb(val, key, o);
  });
  return res;
}

function omit(o, keys) {
  var res = {};
  for (var key in o) {
    if (o.hasOwnProperty(key) && !contains(keys, key)) {
      res[key] = o[key];
    }
  }
  return res;
}

function get(prop, val) {
  var segs = prop.split('.');
  while (prop = segs.shift()) val = val[prop];
  return val;
}

// console.log(get('a.b.c', {a: {b: {c: null}}}));
// console.log(get('2.a', [{a: 'b'}, {a: 'c'}, {a: 'd'}]));

function contains(o, val) {
  return some(o, equals(val));
}

function equals (a) {
  return function (b) {
    return a === b;
  };
}



function is(val, type) {
  return typeOf(val) === type;
}

function some(o, cb, thisArg) {
  cb = iterator(cb, thisArg);
  var res = false;

  forOwn(o, function (val, key) {
    if (cb(val, key, o)) {
      res = true;
      return false;
    }
  });
  return res;
}

function filter(o, cb, thisArg) {
  cb = iterator(cb, thisArg);
  var res = {};

  forOwn(o, function (val, key, obj) {
    if (cb(val, key, obj)) {
      res[key] = val;
    }
  });
  return res;
}

function map(o, cb, thisArg) {
  cb = iterator(cb, thisArg);
  var res = {};

  forOwn(o, function (val, key, o) {
    res[key] = cb(val, key, o);
  });
  return res;
}

function extend(o, objects) {
  var len = arguments.length;
  var i = -1;
  var obj;

  while (++i < len) {
    obj = arguments[i];
    if (obj != null) {
      forOwn(obj, function(val, key) {
        this[key] = val;
      }, o);
    }
  }
  return o;
}


function forOwn(o, fn, thisArg) {
  forIn(o, function (val, key) {
    if (hasOwn(o, key)) {
      return fn.call(thisArg, o[key], key, o);
    }
  });
}

function forIn(o, fn, thisArg) {
  var key, i = 0;

  for (key in o) {
    if (fn.call(thisArg, o[key], key, o) === false) {
      break;
    }
  }
}
