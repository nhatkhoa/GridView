window.Dom || (function(window) {
  'use strict';

  window.Dom = {
    createElement: function(tag, attributes, children, callbackEvent) {
      var node = document.createElement(tag);
      if (attributes) {
        for (var i in attributes) {
          node[i] = attributes[i];
        }
      }
      if (callbackEvent) {
        console.debug('Added event for ' + tag);

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
    update: function(afterNode, node) {
      afterNode.parentNode.insertBefore(node, afterNode);
      afterNode.remove();
    },
    remove: function(node) {
      if (node instanceof HTMLElement)
        node.remove();
    },
    render: function(node, parent) {
      parent.appendChild(node);
    },
    clear: function(parent) {
      parent.innerHTML = '';
    }
  };
})(window);
