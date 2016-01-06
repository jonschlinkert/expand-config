'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Config = require('..');
var config;

describe('configs', function () {
  beforeEach(function() {
    config = new Config();
  });

  describe('tasks', function () {
    it('should expose an "options" property', function () {
      config.expand({});
      assert(config.options);
    });

    it('should expose an expand method', function() {
      assert.equal(typeof config.expand, 'function');
    });

    it('should recognize tasks', function () {
      config.expand({foo: {a: {src: '*'}}});
      assert(config.tasks);
    });

    it('should add tasks to the `tasks` property', function() {
      config.expand({
        foo: {a: {src: '*'}},
        bar: {a: {src: '*'}}
      });
      assert(config.tasks.foo);
      assert(config.tasks.bar);
    });

    it('should expand src patterns in targets', function() {
      config.expand({
        foo: {a: {src: '*.md'}},
        bar: {a: {src: '*.js'}},
      });
      assert(Array.isArray(config.tasks.foo.a.files));
      assert(Array.isArray(config.tasks.foo.a.files[0].src));
      assert(config.tasks.foo.a.files[0].src.length);
    });

    it('should use task options on targets', function() {
      config.expand({
        options: {cwd: 'test/fixtures'},
        foo: {a: {src: 'a.*'}},
        bar: {a: {src: 'one.*'}},
      });
      assert(config.tasks.foo.a.files[0].src[0] === 'a.txt');
      assert(config.tasks.bar.a.files[0].src[0] === 'one.md');
    });

    it('should retain arbitrary properties on tasks', function() {
      config.expand({
        foo: {a: {src: '*.md', data: {title: 'My Blog'}}},
        bar: {a: {src: '*.js'}},
      });
      assert(config.tasks.foo.a.files[0].data);
      assert(config.tasks.foo.a.files[0].data.title);
      assert(config.tasks.foo.a.files[0].data.title === 'My Blog');
    });

    it('should use plugins on tasks', function() {
      config.use(function(config) {
        return function fn(node) {
          if (config.options.data && !node.data) {
            node.data = config.options.data;
          }
          console.log(node.is)
          return fn;
        }
      });

      config.expand({
        options: {data: {title: 'My Site'}},
        foo: {a: {src: '*.md', data: {title: 'My Blog'}}},
        bar: {a: {src: '*.js'}},
      });

      assert(config.tasks.foo.a.files[0].data);
      assert(config.tasks.foo.a.files[0].data.title);
      assert(config.tasks.foo.a.files[0].data.title === 'My Blog');

      assert(config.tasks.bar.a.options.data);
      assert(config.tasks.bar.a.options.data.title === 'My Site');
      assert(config.tasks.bar.a.files[0].data);
      assert(config.tasks.bar.a.files[0].data.title);
      assert(config.tasks.bar.a.files[0].data.title === 'My Site');
    });
  });

  describe('targets', function() {
    it('should expose an "options" property', function() {
      config.expand({});
      assert(config.options);
    });

    it('should expose an expand method', function() {
      assert.equal(typeof config.expand, 'function');
    });

    it('should add targets to `targets`', function() {
      config.expand({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(config.targets.foo);
      assert(config.targets.bar);
    });

    it('should expand src patterns in targets', function() {
      config.expand({
        foo: {src: '*.md'},
        bar: {src: '*.js'}
      });
      assert(Array.isArray(config.targets.foo.files));
      assert(Array.isArray(config.targets.foo.files[0].src));
      assert(config.targets.foo.files[0].src.length);
    });

    it('should use task options on targets', function() {
      config.expand({
        options: {cwd: 'test/fixtures'},
        foo: {src: 'a.*'},
        bar: {src: 'one.*'}
      });
      assert(config.targets.foo.files[0].src[0] === 'a.txt');
      assert(config.targets.bar.files[0].src[0] === 'one.md');
    });

    it('should retain arbitrary properties on targets', function() {
      config.expand({
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });
      assert(config.targets.foo.files[0].data);
      assert(config.targets.foo.files[0].data.title);
      assert(config.targets.foo.files[0].data.title === 'My Blog');
    });

    it('should use plugins on targets', function() {
      config.use(function(config) {
        return function fn(node) {
          if (config.options.data && !node.data) {
            node.data = config.options.data;
          }
          return fn;
        }
      });

      config.expand({
        options: {data: {title: 'My Site'}},
        foo: {src: '*.md', data: {title: 'My Blog'}},
        bar: {src: '*.js'}
      });

      assert(config.targets.foo.files[0].data);
      assert(config.targets.foo.files[0].data.title);
      assert(config.targets.foo.files[0].data.title === 'My Blog');

      assert(config.targets.bar.options.data);
      assert(config.targets.bar.options.data.title === 'My Site');
      assert(config.targets.bar.files[0].data);
      assert(config.targets.bar.files[0].data.title);
      assert(config.targets.bar.files[0].data.title === 'My Site');
    });
  });
});

