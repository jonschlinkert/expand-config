'use strict';

var Base = require('base-methods');

function Node(config, parent) {
  Base.call(this, config);
  this.define('parent', parent);
  this.define('root', this.get('parent.root')
    || this.get('parent.orig')
    || this.orig
    || this);
}

Base.extend(Node);

/**
 * Expose `Node`
 */

module.exports = Node;
