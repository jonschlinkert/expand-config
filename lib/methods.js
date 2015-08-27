'use strict';

var reserved = require('./lib/reserved');
var Files = require('./lib/files');
var utils = require('./lib/utils');

/**
 * Normalize options. If a `parent` object exists,
 * and it has an `options` object, it will be used
 * to extend the config.
 */

function normalizeOpts(name, current, resv) {
  resv = resv || reserved.opts;

  return function(config) {
    config.options = config.options || {};

    for (var key in config) {
      if (~resv.indexOf(key)) {
        config.options[key] = config[key];
        delete config[key];
        continue;
      }
      validate(key);
    }

    if (current.parent && current.parent.options) {
      config.options = utils.merge({}, current.parent.options, config.options);
    }


    // resolve templates using the `current` object as context
    var process = config.options.process;
    if (!process) return config;

    var ctx = {};

    // process `<%= foo %>` config templates
    if (process === name) {
      if (name === 'node') {
        config = utils.expand(config);
      }
      ctx = utils.merge({}, current.orig, config);
      config = utils.expand(config, ctx);
    } else if (name === 'node' && process === 'target') {
      config = utils.expand(config, current.orig);
    } else if (name === 'node' && process === 'task') {
      config = utils.expand(config, current.parent.orig);
    } else if (name === 'target' && process === 'task') {
      config = utils.expand(config, current.parent.orig);
    } else if (process === 'all') {
      if (name === 'node') {
        config = utils.expand(config);
      }
      config = utils.expand(config, current.orig);
      config = utils.expand(config, current.parent.orig);
    }

    config = utils.expand(config, current.root);
    return config;
  };
}

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

function normalizeFiles(config) {
  config.files = utils.arrayify(config.files || []);
  var files = utils.hasValues(config, ['src', 'dest']);
  if (files) config.files.push(files);
  delete config.src;
  delete config.dest;
  return config;
}

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

function expandFiles(target) {
  return function(config) {
    var obj = utils.omit(config, ['files', 'options']);
    var len = config.files.length, i = -1;
    var files = [];

    while (++i < len) {
      var node = utils.clone(obj);

      if (target.task) node.task = target.task;
      if (target.target) node.target = target.target;

      // merge `config.options`
      var ele = normalizeOpts('node', target)(config.files[i]);
      ele.options = utils.merge({}, config.options, ele.options);

      // expand 'path-objects': 'files: [{'foo/': 'bar/*.js'}]`
      var mapping = toMapping(ele, config);
      if (mapping.files) {
        // if a `files` property exists, then
        // 'path-object' patterns were expanded
        return expandFiles(target)(mapping);
      }

      // merge `config.files`
      node = utils.merge({}, node, ele);
      files = files.concat(new Files(node));
    }
    config.files = files;
    return config;
  };
}

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

function toMapping(node, config) {
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
  node = utils.omit(node, keys);

  // extend non-files config properties onto the node
  var nonfiles = utils.omit(config, ['files']);
  return utils.extend(node, nonfiles);
}


function validate(name) {
  if (~reserved.methods.indexOf(name)) {
    throw new Error(name + ' is a reserved target-level property.');
  }
}


exports.normalizeOpts = normalizeOpts;
exports.normalizeFiles = normalizeFiles;
exports.expandFiles = expandFiles;
exports.toMapping = toMapping;
