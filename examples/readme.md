# Config examples

**Before**

All of these examples 

```js
{files: {'dist/': '*.js'}}
{files: [{src: '*.js', dest: 'dist/'}]}
{src: '*.js', dest: 'dist/'}
{src: ['*.js'], dest: 'dist/'}
```

**After**

Normalize to:

```js
{files: [{src: ['index.js'], dest: 'dist/'}]}
```

***


All of the following:

```js
var config = require('{%= name %}')({
  options: {
    expand: true,
    cwd: 'test/fixtures'
  },
  files: {
    'dist/a/': ['a/*.js'],
    'dist/b/': ['b/*.js']
  }
});

config({
  options: {
    expand: true,
    cwd: 'test/fixtures'
  },
  files: [
    {dest: 'dist/a/', src: ['a/*.js']},
    {dest: 'dist/b/', src: ['b/*.js']}
  ]
});

config({
  options: {
    cwd: 'test/fixtures'
  },
  files: [
    {expand: true, dest: 'dist/a/', src: ['a/*.js']},
    {expand: true, dest: 'dist/b/', src: ['b/*.js']}
  ]
});

config({
  options: {
    cwd: 'test/fixtures'
  },
  files: [
    {options: {expand: true}, dest: 'dist/a/', src: ['a/*.js']},
    {options: {expand: true}, dest: 'dist/b/', src: ['b/*.js']}
  ]
});

console.log(config);
```

Would normalize to the following (see the [test fixtures](./test/fixtures)):

```js
{ files:
   [ { src: [ 'a/x.js' ],
       dest: 'dist/a/a/x.js',
       orig:
        { options: { expand: true, cwd: 'test/fixtures' },
          src: [ 'a/*.js' ],
          dest: 'dist/a/' } },
     { src: [ 'a/y.js' ],
       dest: 'dist/a/a/y.js',
       orig:
        { options: { expand: true, cwd: 'test/fixtures' },
          src: [ 'a/*.js' ],
          dest: 'dist/a/' } },
     { src: [ 'b/x.js' ],
       dest: 'dist/b/b/x.js',
       orig:
        { options: { expand: true, cwd: 'test/fixtures' },
          src: [ 'b/*.js' ],
          dest: 'dist/b/' } },
     { src: [ 'b/y.js' ],
       dest: 'dist/b/b/y.js',
       orig:
        { options: { expand: true, cwd: 'test/fixtures' },
          src: [ 'b/*.js' ],
          dest: 'dist/b/' } },
     { src: [ 'b/z.js' ],
       dest: 'dist/b/b/z.js',
       orig:
        { options: { expand: true, cwd: 'test/fixtures' },
          src: [ 'b/*.js' ],
          dest: 'dist/b/' } } ] }
```


### options.expand

Dynamically generate destination paths by defining `:params` that describe the structure paths should use:

**Example:**

```js
config({
  options: {
    expand: ':dirname/:name.min.js'
  },
  src: ['*.js'],
  dest: 'scripts/'
});
```
