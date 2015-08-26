'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

/**
 * Create an instance of `Files` to expand src-dest
 * mappings on the given `config`.
 */

function Files(config) {
  config = config || {};
  config.options = config.options || {};
  this.cache = {};
  return this.expand(config);
}

Files.prototype = {
  constructor: Files,

  /**
   * Expand glob patterns in `src`
   *
   * @param {Object} `config`
   * @return {Object}
   */

  expand: function(config) {
    if (!config.src) return config;
    var orig = config.src;
    config.src = utils.glob.sync(orig, config.options);

    if (!config.src.length) {
      if (config.options.nonull === true) {
        config.src = orig;
        return config;
      } else {
        config.src = [];
        return config;
      }
    }

    if (config.options.expand === true) {
      return this.expandMapping(config);
    }
    return config;
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
          res = utils.extend({}, config, result);
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

    // if `options.filter` is a string and matches a `fs.stat`
    // method, call the `fs.stat` method on the file
    } else if (typeof filter === 'string') {
      if (['isFile', 'isDirectory', 'isSymlink'].indexOf(filter) < 0) {
        var msg = '[options.filter] `' + filter + '` is not a valid fs.lstat method name';
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
