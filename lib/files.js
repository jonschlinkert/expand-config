'use strict';

var fs = require('fs');
var path = require('path');
var methods = require('./methods');
var utils = require('./utils');

/**
 * Create an instance of `Files` to expand src-dest
 * mappings on the given `config`.
 */

function Files(config) {
  if (!(this instanceof Files)) {
    return new Files(config);
  }
  if (arguments.length > 1) {
    config = this.toConfig.apply(this, arguments);
  }
  config = config || {};
  config.options = config.options || {};
  this.cache = {};
  return this.expand(config);
}

Files.prototype = {
  constructor: Files,

  toConfig: function (src, dest, options) {
    if (typeof src !== 'string' && !Array.isArray(src)) {
      return src;
    }
    var config = {};
    config.src = src || '';
    if (typeof dest !== 'string') {
      options = dest;
      dest = '';
    }
    config.options = options || {};
    config.dest = dest || '';
    return config;
  },

  normalize: function (config) {
    var orig = utils.clone(config);
    var res = methods.toMapping(config);
    var files = [];

    if (res.hasOwnProperty('files')) {
      var len = res.files.length, i = -1;

      while (++i < len) {
        var obj = res.files[i];
        obj.options = obj.options || {};
        obj = this.expand(obj);
        delete obj.options;
        files = files.concat(obj);
      }
    }

    if (files.length) return files;
    return orig;
  },

  /**
   * Expand glob patterns in `src`
   *
   * @param {Object} `config`
   * @return {Object}
   */

  expand: function(config, cb) {
    var opts = utils.pick(config, utils.optsKeys);
    var rest = utils.omit(config, utils.optsKeys);
    config.options = utils.merge({}, opts, rest.options);

    if (!config.src) return this.normalize(config, cb);

    var orig = config.src;
    var glob = config.options.glob || utils.glob;
    if (typeof cb === 'function') {
      var self = this;
      return glob(orig, config.options, function (err, src) {
        config.src = src;
        self.doStuff(config, cb);
      });
    }

    config.src = glob.sync(orig, config.options);
    return this.doStuff(config, function (err, config) {
      return config;
    });
  },

  doStuff: function (config, cb) {
    if (!config.src.length) {
      if (config.options.nonull === true) {
        config.src = orig;
      } else {
        config.src = [];
      }
      return cb(null, utils.arrayify(config));
    }

    if (config.options.expand === true) {
      return cb(null, this.expandMapping(config));
    }

    var res = utils.pick(config, ['src', 'dest']);
    return cb(null, utils.arrayify(res));
  },

  /**
   * Expand `src-dest` mappings.
   */

  expandMapping: function (config) {
    var len = config.src.length, i = -1;
    var files = [];

    while (++i < len) {
      var result = this.mapDest(config.dest, config.src[i], config);
      if (result === false) continue;
      var dest = utils.unixify(result.dest);
      var src = utils.unixify(result.src);
      if (this.cache[dest]) {
        this.cache[dest].src.push(src);
      } else {
        result.src = [src];
        var res = result;
        if (config.options.extend) {
          res = utils.merge({}, config, res);
        }
        files.push(res);
        this.cache[dest] = this.cache[dest] || result;
      }
    }
    return files;
  },

  /**
   * Map destination paths
   */

  mapDest: function (dest, src, config) {
    var opts = config.options;
    var fp = src;

    var isMatch = this.filter(fp, opts);
    if (!isMatch) return false;

    // if `options.flatten` is defined, use the `src` basename
    if (opts.flatten) fp = path.basename(fp);

    // if `options.ext` is defined, use it to replace extension
    if (opts.hasOwnProperty('ext')) {
      fp = utils.replaceExt(fp, opts);
    }

    // use rename function to modify dest path
    var result = this.rename(dest, fp, config);

    // if `options.cwd` is defined, prepend it to `src`
    if (opts.cwd) {
      src = path.join(opts.cwd, src);
    }
    return {src: src, dest: result};
  },

  /**
   * Default filter function.
   */

  filter: function(fp, opts) {
    var filter = opts.filter;
    var isMatch = true;

    if (!filter) return isMatch;

    // if `options.filter` is a function, use it to
    // conditionally exclude a file from the result set
    if (typeof filter === 'function') {
      isMatch = filter(fp);

    // if `options.filter` is a string and matches a `fs.lstat`
    // method, call the `fs.lstat` method on the file
    } else if (typeof filter === 'string') {
      if (['isFile', 'isDirectory', 'isSymbolicLink'].indexOf(filter) < 0) {
        var msg = '[options.filter] `' + filter
          + '` is not a valid fs.lstat method name';
        throw new Error(msg);
      }
      try {
        isMatch = fs.lstatSync(fp)[filter]();
      } catch (err) {
        isMatch = false;
      }
    }
    return isMatch;
  },

  /**
   * Default rename function.
   */

  rename: function(dest, src, config) {
    var opts = config.options;
    if (typeof opts.rename === 'function') {
      return opts.rename.call(utils.parsePath(src), dest, src, config.options);
    }
    return dest ? path.join(dest, src) : src;
  }
};

/**
 * Expose `Files`
 */

module.exports = Files;
