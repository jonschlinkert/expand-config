'use strict';


exports.taskKeys = ['options', 'task'];
exports.targetKeys = [
  'target',
  'files',
  'src',
  'dest'
];

exports.filesKeys = [
  'src',
  'dest'
];

exports.opts = [
  'base',
  'cwd',
  'destBase',
  'expand',
  'ext',
  'extDot',
  'extend',
  'flatten',
  'rename',
  'process',
  'srcBase'
];

exports.methods = [
  'get',
  'set',
  'del',
  'define',
  'visit',
  'normalize'
];

exports.all = exports.opts.concat(exports.methods);
