var GridView = (function() {
  'use strict';

  function GridView(options) {
    this.options = options || {};
    if (!this.options.renderTo) {
      this.options.renderTo = document.body;
    }
    this.render();
    this._header = this.options.renderTo.querySelector('thead');
    this._body = this.options.renderTo.querySelector('tbody');
  }

  Object.defineProperty(GridView, 'options', {
    get: function() {
      return this._options;
    },
    set: function(options) {
      this._options = options;
    }
  });

  GridView.prototype.render = function() {
    var headers = [];
    for (var i = 0; i < this.options.columns.length; ++i) {
      headers.push(Dom.createElement('th', null, [this.options.columns[i].header]));
    }
    headers.push(Dom.createElement('th', null, ['']));
    Dom.render(
      Dom.createElement('div', { className: 'panel panel-default' }, [
        Dom.createElement('div', { className: 'panel-heading' }, [
          Dom.createElement('div', { className: 'panel-title' }, [
            Dom.createElement('h3', null, [
              Dom.createElement('label', null, ['Sample GridView Control'])
            ])
          ])
        ]),
        Dom.createElement('div', { className: 'panel-body' }, [
          Dom.createElement('table', { className: 'table' }, [
            Dom.createElement('thead', null, [
              Dom.createElement('tr', null, headers)
            ]),
            Dom.createElement('tbody')
          ])
        ]),
        Dom.createElement('div', { className: 'panel-footer' }, [
          Dom.createElement('button', { type: 'button', className: 'btn btn-default' }, ['Add Row'])
        ])
      ]),
      this.options.renderTo
    );
  };

  GridView.prototype.loadData = function(data) {
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; ++i) {
        this.addRow(data[i]);
      }
    }
  };

  GridView.prototype.addRow = function(dataRow) {
    var row = [];
    var columns = this.options.columns;
    for (var i = 0, dataIndex, display, content; i < columns.length; ++i) {
      dataIndex = columns[i].dataIndex;
      content = dataRow[dataIndex] ? dataRow[dataIndex] : '';
      display = columns[i].display;
      content = display ? display(content) : String(content);
      row.push(Dom.createElement('td', null, [content]));
    }
    row.push(Dom.createElement('td', null, [
      Dom.createElement('button', { type: 'button', className: 'btn btn-link' }, [
        Dom.createElement('span', { className: 'glyphicon glyphicon-edit' })
      ]),
      Dom.createElement('button', { type: 'button', className: 'btn btn-link' }, [
        Dom.createElement('span', { className: 'glyphicon glyphicon-remove' })
      ])
    ]));
    Dom.render(
      Dom.createElement('tr', null, row),
      this._body
    );
  };

  return GridView;
})();
