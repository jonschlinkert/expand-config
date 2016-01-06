# Plugins

> Plugins can be used to modify the config object and it's properties at each "stage" of normalization or transformation. 

**Why use plugins?**

The advantage of using plugins is that any transformations you might need to do to the returned object can be performed without having to recurse over the object again. As a result, it could be faster than other options, and it also provides an easy way to modify specific properties.

**How do plugins work?**

A plugin is a function that takes `config` as its only parameter. 

Plugins must be registered before the configuration is expanded, which means that instead of passing the config object to the constructor, you'll need to:

1. create an instance by doing `var config = new Config()`
1. add your plugins
1. call the `expand` method on the object you want to expand after plugins are registered.

**Example**

```js
var config = new Config({cwd: 'foo'});

config
  .use(foo)
  .use(bar)
  .use(baz);

config.expand({
  site: {
    src: '*.js',
    dest: ''
  }
});
```

**Working example**

```js
var config = new Files();
config.use(function(obj) {
  obj.foo = 'bar';
});
console.log(config.expand({src: '*.js'}));
```

Results in an object that looks something like:

```js
{
  options: {},
  foo: 'bar', //<= our added property
  files: [{
    options: {},
    src: ['examples.js', 'gulpfile.js', 'index.js', 'utils.js'],
    dest: '' }
  ]
}
```

### Nodes

It's also possible to modify individual files nodes as they're created on the `files` array. To do so, simply return a function in the plugin and it will be called on each node.

**Examples**

```js
var config = new Files();
function updateNode(config) {
  config.foo = 'bar';

  return function fn(node) {
    if (!node.filesNode) return fn;
    // return the plugin function if it's not a filesNode
    // this way we know with certainty that `node`
    // will be a filesNode
    node.options.one = 'two';
    node.dest = 'baz/';
    node.abc = 'xyz';
  };
}
config.use(updateNode);
console.log(config.expand({src: '*.js'}));
```

Results in an object that looks something like:

```js
{
  options: {},
  foo: 'bar', //<= our added `config` property
  files: [{
    options: { one: 'two' },
    src: ['examples.js', 'gulpfile.js', 'index.js', 'utils.js'],
    dest: 'baz/',
    abc: 'xyz' }
  ]
}
```


Additionally, you can either modify the node before it's normalized or after, by checking for the `rawNode` property or `filesNode` respectively.


### Writing plugins

Plugins are just functions where the only parameter exposed is the current "context", which is either the configuration object you passed in, or some property on that object - before or after it's transformed. 

**Examples**

In the following plugin, `config` is the target instance:

```js
target.use(function(config) {
  config.foo = 'bar';
});
console.log(target.foo);
//=> 'bar'
```

To have the plugin called in a "child" context, like for iterating over files nodes as they're expanded, just return the plugin function until you get the node you want:

```js
target.use(function fn(config) {
  if (!config.node) return fn;
  console.log(config);
});
```

**Contexts**

To see all available contexts, just do the following:

```js
target.use(function fn(config) {
  console.log('-----', config._name, '----');
  console.log(config);
  console.log('---------------------------');
  return fn;
});
```

This is a list of all possible contexts:

* `config`
  - `task`
    + `target`
      - `normalized`
        * `rawNode`
        * `filesNode`
      - `expanded`