'use strict';

var utils = require('expand-utils');
var define = require('define-property');
var Target = require('expand-target');
var Task = require('expand-task');
var use = require('use');

/**
 * Expand a declarative configuration with tasks and targets.
 * Create a new Config with the given `options`
 *
 * ```js
 * var config = new Config();
 *
 * // example usage
 * config.expand({
 *   jshint: {
 *     src: ['*.js', 'lib/*.js']
 *   }
 * });
 * ```
 * @param {Object} `options`
 * @api public
 */

function Config(options) {
  if (!(this instanceof Config)) {
    return new Config(options);
  }

  utils.is(this, 'config');
  use(this);

  define(this, 'count', 0);
  this.options = options || {};
  this.targets = {};
  this.tasks = {};

  if (utils.isConfig(options)) {
    this.options = {};
    this.expand(options);
    return this;
  }
}

/**
 * Expand and normalize a declarative configuration into tasks, targets,
 * and `options`.
 *
 * ```js
 * config.expand({
 *   options: {},
 *   assemble: {
 *     site: {
 *       mapDest: true,
 *       src: 'templates/*.hbs',
 *       dest: 'site/'
 *     },
 *     docs: {
 *       src: 'content/*.md',
 *       dest: 'site/docs/'
 *     }
 *   }
 * });
 * ```
 * @param {Object} `config` Config object with tasks and/or targets.
 * @return {Object}
 * @api public
 */

Config.prototype.expand = function(config) {
  if (utils.isTarget(config)) {
    this.addTarget('target' + (this.count++), config);
    return this;
  }

  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      var val = config[key];

      if (utils.isTask(val)) {
        this.addTask(key, val);

      } else if (utils.isTarget(val)) {
        this.addTarget(key, val);

      } else {
        this[key] = val;
      }
    }
  }
};

/**
 * Add a task to the config, while also normalizing targets with src-dest mappings and
 * expanding glob patterns in each target.
 *
 * ```js
 * task.addTask('assemble', {
 *   site: {src: '*.hbs', dest: 'templates/'},
 *   docs: {src: '*.md', dest: 'content/'}
 * });
 * ```
 * @param {String} `name` the task's name
 * @param {Object} `config` Task object where each key is a target or `options`.
 * @return {Object}
 * @api public
 */

Config.prototype.addTask = function(name, config) {
  if (typeof name !== 'string') {
    throw new TypeError('Config#addTask expects name to be a string');
  }
  var task = new Task(this.options);
  define(task, 'name', name);

  utils.run(this, 'config', task);
  task.addTargets(config);

  this.tasks[name] = task;
  return task;
};

/**
 * Add a target to the config, while also normalizing src-dest mappings and
 * expanding glob patterns in the target.
 *
 * ```js
 * config.addTarget({src: '*.hbs', dest: 'templates/'});
 * ```
 * @param {String} `name` The target's name
 * @param {Object} `target` Target object with a `files` property, or `src` and optionally a `dest` property.
 * @return {Object}
 * @api public
 */

Config.prototype.addTarget = function(name, config) {
  if (typeof name !== 'string') {
    throw new TypeError('Config#addTarget expects name to be a string');
  }
  var target = new Target(this.options);
  define(target, 'name', name);

  utils.run(this, 'target', target);
  target.addFiles(config);

  this.targets[name] = target;
  return target;
};

/**
 * Expose `Config`
 */

module.exports = Config;
