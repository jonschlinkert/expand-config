'use strict';

var reserved = require('./reserved');
var Files = require('./files');
var utils = require('./utils');

function Target(name, config, parent) {
  if (!(this instanceof Target)) {
    return new Target(name, config, parent);
  }

  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = null;
  }

  if (typeof parent === 'object') {
    utils.define(this, 'parent', parent);
    if (parent.task || parent.taskname) {
      this.taskname = parent.task || parent.taskname;
    }
  }

  if (typeof name === 'string') {
    this.targetname = name;
  }

  this.config = config || {};
  utils.define(this, 'orig', utils.clone(config));
  this.normalizeOpts(this.config);
  this.normalizeFiles(this.config);
  this.expandFiles(this.config);
  return this;
}

Target.prototype = {
  constructor: Target,

  /**
   * Normalize options. If a `parent` object exists,
   * and it has an `options` object, it will be used
   * to extend the config.
   */

  normalizeOpts: function(config) {
    config = config || this.config;
    config.options = config.options || {};

    for (var key in config) {
      if (~reserved.opts.indexOf(key)) {
        config.options[key] = config[key];
        delete config[key];
        continue;
      }
      this.validate(key);
    }

    if (this.parent && this.parent.options) {
      config.options = utils.merge({}, this.parent.options, config.options);
    }

    // resolve templates using the `target` object as context
    var process = config.options.process;
    if (process === 'target' || process === true) {
      config = utils.expand(config, utils.merge({}, this.orig, config));
    }

    this.config = config;
    return this;
  },

  /**
   * Ensure that basic `files` properties are defined
   * before trying to expand them.
   *
   * ```js
   * // before
   * {src: 'a', dest: 'b', options: { foo: 'bar' }}
   * // after
   * {options: { foo: 'bar' }, files: [ { src: 'a', dest: 'b' } ]}
   * ```
   */

  normalizeFiles: function(config) {
    config = config || this.config;
    config.files = utils.arrayify(config.files || []);
    var files = utils.hasValues(config, ['src', 'dest']);
    if (files) {
      config.files.push(files);
    }

    delete this.config.src;
    delete this.config.dest;
    return this;
  },

  /**
   * Expand the `files` array into normalized `src-dest` mappings.
   *
   * ```js
   * // before:
   * { src: '*.txt' }
   *
   * // after:
   * // [ { src: [ 'test/fixtures/a.txt' ], dest: 'a.txt' },
   * //   { src: [ 'test/fixtures/b.txt' ], dest: 'b.txt' },
   * //   { src: [ 'test/fixtures/c.txt' ], dest: 'c.txt' } ]
   * ```
   */

  expandFiles: function(config) {
    config = config || this.config;
    var target = utils.omit(config, ['files', 'options']);
    var len = config.files.length, i = -1;
    var files = [];

    while (++i < len) {
      var node = utils.clone(target);

      if (this.taskname) node.taskname = this.taskname;
      if (this.targetname) node.targetname = this.targetname;

      // merge `config.options`
      node.options = utils.merge({}, config.options, node.options);
      var ele = config.files[i];

      // expand 'path-objects': 'files: [{'foo/': 'bar/*.js'}]`
      var mapping = this.toMapping(ele, config);
      if (mapping.files) {
        // if a `files` property exists, then
        // 'path-object' patterns were expanded
        return this.expandFiles(mapping);
      }

      // merge `config.files`
      utils.merge(node, ele);

      // resolve config templates using the `node` as context
      if (node.options.process === 'node') {
        node = utils.expand(node, utils.merge({}, this.orig, node));
      }

      var mapping = new Files(node);
      files = files.concat(mapping);
    }
    this.config.files = files;
    return this;
  },

  /**
   * Expand 'path-objects' into an array of `src-dest` mappings.
   *
   * ```js
   * target.toMapping({
   *   'foo/': ['bar/*.js']
   * });
   * //=> {files: [{src: ['bar/*.js'], dest: 'foo/'}]}
   * ```
   */

  toMapping: function (node, config) {
    if ('src' in node || 'dest' in node) {
      return node;
    }

    var keys = Object.keys(node);
    node.files = node.files || [];
    keys.forEach(function (key) {
      node.files.push({
        src: node[key],
        dest: key
      });
    });

    // omit the original 'path-objects' from the node
    node = utils.omit(node, keys);;

    // extend non-files config properties onto the node
    var nonfiles = utils.omit(config, ['files']);
    return utils.extend(node, nonfiles);
  },

  validate: function (name) {
    if (~reserved.methods.indexOf(name)) {
      throw new Error(name + ' is a reserved target-level property.');
    }
  }
};

module.exports = Target;
