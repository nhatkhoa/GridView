window.Dom || (function(window) {
  'use strict';

  window.Dom = {
    createElement: function(tag, attributes, children) {
      var node = document.createElement(tag);
      if (attributes) {
        for (var i in attributes) {
          node[i] =  attributes[i];
        }
      }
      if (children && children.length > 0) {
        for (var i = 0, child; i < children.length; ++i) {
          child = children[i];
          if (typeof(child) === 'string') {
            child = document.createTextNode(child);
          }
          node.appendChild(child);
        }
      }
      return node;
    },
    render: function(node, parent) {
      parent.appendChild(node);
    }
  };
})(window);
