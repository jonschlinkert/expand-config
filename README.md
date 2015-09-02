# expand-config [![NPM version](https://badge.fury.io/js/expand-config.svg)](http://badge.fury.io/js/expand-config)

> Expand tasks, targets and files in a declarative configuration.

## TOC

<!-- toc -->

* [Usage](#usage)
* [Docs](#docs)
  - [Tasks](#tasks)
  - [Targets](#targets)
  - [Files](#files)
* [Related projects](#related-projects)
* [Running tests](#running-tests)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)

_(Table of contents generated by [verb](https://github.com/verbose/verb))_

<!-- tocstop -->

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i expand-config --save
```

## Usage

Expand a declarative configuration with tasks, targets and files mappings. Optionally pass a `name` as the first argument.

```js
var config = require('expand-config');

config('assemble', {
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

**commented**

```js
// task: `assemble`
config('assemble', {
  // target: `site`
  site: {
    // this is referred to as a `node`, since
    // a number of different formats are possible
    // like `{files: [{src: ['*.js'], dest: 'foo/'}]}`
    // etc
    src: 'templates/*.hbs',
    dest: 'site/'
  },
  
  // target: `blog`
  blog: {
    src: 'content/*.md',
    dest: 'site/blog/'
  }
});
```

## Docs

The [unit tests](./test/) have lots of good usage examples. You can visit the following libraries if you want to dive deeper into the API/features and options for each configuration type.

### Tasks

Visit [expand-task](https://github.com/jonschlinkert/expand-task) to see the docs and full range of options for task expansion.

### Targets

Visit [expand-target](https://github.com/jonschlinkert/expand-target) to see the docs and full range of options for target expansion.

### Files

Visit [expand-files](https://github.com/jonschlinkert/expand-files) to see the docs and full range of options for files expansion.

## Related projects

* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files)
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand and normalize task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [files-objects](https://www.npmjs.com/package/files-objects): Expand files objects into src-dest mappings. | [homepage](https://github.com/jonschlinkert/files-objects)

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

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on September 02, 2015._
