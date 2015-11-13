# expand-config [![NPM version](https://badge.fury.io/js/expand-config.svg)](http://badge.fury.io/js/expand-config)  [![Build Status](https://travis-ci.org/jonschlinkert/expand-config.svg)](https://travis-ci.org/jonschlinkert/expand-config)

> Expand tasks, targets and files in a declarative configuration.

## TOC

- [Usage](#usage)
- [API](#api)
- [Docs](#docs)
  * [Tasks](#tasks)
  * [Targets](#targets)
  * [Files](#files)
- [Related projects](#related-projects)
- [Running tests](#running-tests)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i expand-config --save
```

## Usage

Expand a declarative configuration with tasks, targets and files mappings. Optionally pass a `name` as the first argument.

```js
var config = require('expand-config');

config({
  site: {
    src: 'templates/*.hbs',
    dest: 'site/'
  },
  blog: {
    src: 'content/*.md',
    dest: 'site/blog/'
  }
});
```

## API

### [Config](index.js#L25)

Expand a declarative configuration with tasks and targets. Create a new Config with the given `options`

**Params**

* `options` **{Object}**

**Example**

```js
var config = new Config();

// example usage
config.expand({
  jshint: {
    src: ['*.js', 'lib/*.js']
  }
});
```

### [.expand](index.js#L71)

Expand and normalize a declarative configuration into tasks, targets, and `options`.

**Params**

* `config` **{Object}**: Config object with tasks and/or targets.
* `returns` **{Object}**

**Example**

```js
config.expand({
  options: {},
  assemble: {
    site: {
      mapDest: true,
      src: 'templates/*.hbs',
      dest: 'site/'
    },
    docs: {
      src: 'content/*.md',
      dest: 'site/docs/'
    }
  }
});
```

### [.addTask](index.js#L108)

Add a task to the config, while also normalizing targets with src-dest mappings and expanding glob patterns in each target.

**Params**

* `name` **{String}**: the task's name
* `config` **{Object}**: Task object where each key is a target or `options`.
* `returns` **{Object}**

**Example**

```js
task.addTask('assemble', {
  site: {src: '*.hbs', dest: 'templates/'},
  docs: {src: '*.md', dest: 'content/'}
});
```

### [.addTarget](index.js#L135)

Add a target to the config, while also normalizing src-dest mappings and expanding glob patterns in the target.

**Params**

* `name` **{String}**: The target's name
* `target` **{Object}**: Target object with a `files` property, or `src` and optionally a `dest` property.
* `returns` **{Object}**

**Example**

```js
config.addTarget({src: '*.hbs', dest: 'templates/'});
```

## Docs

The [unit tests](./test/) have lots of good usage examples. You can visit the following libraries if you want to dive deeper into the API/features and options for each configuration type.

### Tasks

Visit [expand-task](https://github.com/jonschlinkert/expand-task) to see the docs and full range of options for task expansion.

### Targets

Visit [expand-target](https://github.com/jonschlinkert/expand-target) to see the docs and full range of options for target expansion.

### Files

Visit [expand-files][] to see the docs and full range of options for files expansion.

## Related projects

* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and files in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-config)
* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files)
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand and normalize task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [expand-utils](https://www.npmjs.com/package/expand-utils): Utils shared by the expand libs. | [homepage](https://github.com/jonschlinkert/expand-utils)
* [files-objects](https://www.npmjs.com/package/files-objects): Expand files objects into src-dest mappings. | [homepage](https://github.com/jonschlinkert/files-objects)
* [normalize-config](https://www.npmjs.com/package/normalize-config): Normalize a declarative configuration with any combination of src-dest mappings, files arrays, files objects and… [more](https://www.npmjs.com/package/normalize-config) | [homepage](https://github.com/jonschlinkert/normalize-config)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/expand-config/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2014-2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on November 13, 2015._