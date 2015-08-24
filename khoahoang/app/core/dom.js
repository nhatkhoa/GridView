window.Dom || (function(window) {
  'use strict';

  window.Dom = {
    createElement: function(tag, attributes, children, callbackEvent, typeEvent) {
      var node = document.createElement(tag);
      if (attributes) {
        for (var i in attributes) {
          node[i] = attributes[i];
        }
      }
      if (callbackEvent) {
        node.addEventListener(typeEvent, callbackEvent);
      }
      if (children && children.length > 0) {
        for (var i = 0, child; i < children.length; ++i) {
          child = children[i];
          if (typeof(child) === 'string') {
            child = document.createTextNode(child);
          }
          console.log('Render child ' + child.nodeName + ' - value : ' + child.innerText + ' (' + child);
          node.appendChild(child);
        }
      }
      return node;
    },
    parseHTML(html) {
      var wraper = document.createElement('div');
      wraper.innerHTML = html;
      return wraper;
    },
    update: function(child, parent) {
      parent.innerHTML = '';
      parent.appendChild(child);
    },
    updates: function(childs, parent) {
      parent.innerHTML = '';
      if (childs && childs.length > 0) {
        for (var i = 0, child; i < childs.length; ++i) {
          child = childs[i];
          parent.appendChild(child);
        }
      }
    },
    render: function(nodeOrHtml, parent) {
      parent.appendChild(nodeOrHtml);
    },
    clear: function(parent) {
      parent.innerHTML = '';
    }
  };
})(window);
