var util = require('util');
var Target = require('../lib/target');

var inspect = function (obj) {
  return util.inspect(obj, null, 10);
};

var target = new Target('assemble', {
  expand: true,
  dest: 'foo/',
  src: '{.*,*.*}'
});

console.log(target.config.files)

// // var a = target('foo', {
// //   src: 'test/fixtures/*.js',
// //   dest: 'site/assets/'
// // });
// // console.log(inspect(a));


// var b = new Target('foo', {
//   // flatten: true,
//   // expand: true,
//   files: [
//     // {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
//     {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
//   ]
// });
// console.log(inspect(b));

// // var c = target('foo', {
// //   files: [
// //     {src: 'test/fixtures/*.js', dest: 'site/assets/'},
// //     {src: 'test/fixtures/*.js', dest: 'site/assets/'},
// //     {src: 'test/fixtures/*.js', dest: 'site/assets/'},
// //   ]
// // });
// // console.log(inspect(c));

// // var d = target('foo', {
// //   cwd: 'test/fixtures',
// //   files: [
// //     {src: '*.js', dest: 'site/assets/'},
// //     {src: '*.js', dest: 'site/assets/'},
// //     {src: '*.js', dest: 'site/assets/'},
// //   ]
// // });
// // console.log(inspect(d));

// // var e = target('foo', {
// //   cwd: 'test/fixtures',
// //   expand: true,
// //   files: [
// //     {src: '*.js', dest: 'site/assets/'},
// //     {src: '*.js', dest: 'site/assets/'},
// //     {src: '*.js', dest: 'site/assets/'},
// //   ]
// // });
// // console.log(inspect(e));

// // var f = target('foo', {
// //   options: {
// //     cwd: 'test/fixtures',
// //     expand: true,
// //   },
// //   files: [
// //     {src: '*.js', dest: 'site/assets/'},
// //     {src: '*.js', dest: 'site/assets/'},
// //     {src: '*.js', dest: 'site/assets/'},
// //   ]
// // });
// // console.log(inspect(f));


// var g = new Target('foo', {
//   expand: true,
//   files: {
//     'dotfiles/': ['.*'],
//     'site/assets/': ['test/fixtures/*.js'],
//   }
// });


// // console.log(inspect(b));
