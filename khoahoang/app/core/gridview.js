/**
 * Old version --> for reference.
 * 
 */


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
    this._dataSource = [];
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
    var grid = this;
    var headers = [];
    for (var i = 0; i < this.options.columns.length; ++i) {
      var headerName = this.options.columns[i].header;
      var flexHeader = 'col-lg-' + this.options.columns[i].flex;
      headers.push(Dom.createElement('th', {
        className: flexHeader
      }, [headerName], function() {
        grid.sortData(headerName);
      }));
    }
    headers.push(Dom.createElement('th', null, ['']));


    function onClickAddRow() {
      var newRow = grid._dataSource[grid._dataSource.length - 1];
      console.log(newRow);
      for (var property in newRow) {
        if (typeof newRow[property] === 'number') {
          newRow[property] = 0;
        } else {
          newRow[property] = 'new value';
        }
      }
      grid.addRow(newRow, null, true);
    }

    Dom.render(
      Dom.createElement('div', {
        className: 'panel panel-default'
      }, [
        Dom.createElement('div', {
          className: 'panel-heading'
        }, [
          Dom.createElement('div', {
            className: 'panel-title'
          }, [
            Dom.createElement('h3', null, [
              Dom.createElement('label', null, ['Sample GridView Control'])
            ])
          ])
        ]),
        Dom.createElement('div', {
          className: 'panel-body'
        }, [
          Dom.createElement('table', {
            className: 'table table-hover'
          }, [
            Dom.createElement('thead', null, [
              Dom.createElement('tr', null, headers)
            ]),
            Dom.createElement('tbody')
          ])
        ]),
        Dom.createElement('div', {
          className: 'panel-footer'
        }, [
          Dom.createElement('button', {
            type: 'button',
            className: 'btn btn-default'
          }, ['Add Row'], onClickAddRow)
        ])
      ]),
      this.options.renderTo
    );


  };

  GridView.prototype.loadData = function(data) {
    if (data && data.length > 0) {
      this._dataSource = data;
      for (var i = 0; i < this._dataSource.length; ++i) {
        this.addRow(this._dataSource[i]);
      }
    }
  };



  GridView.prototype.addRow = function(dataRow, oldNode, isNewRow) {
    var grid = this;
    var row = [];
    var element = {};
    var columns = this.options.columns;
    for (var i = 0, dataIndex, display, content; i < columns.length; ++i) {
      dataIndex = columns[i].dataIndex;
      content = dataRow[dataIndex] ? dataRow[dataIndex] : '';
      display = columns[i].display;
      content = display ? display(content) : String(content);
      row.push(Dom.createElement('td', {
        className: 'field-' + dataIndex
      }, [content]));
    }

    function onRemoveEvent() {
      grid.removeRow(element);
    }

    function onEditEvent() {
      grid.editRow(element, dataRow);
    }

    row.push(Dom.createElement('td', null, [
      Dom.createElement('button', {
        type: 'button',
        className: 'btn btn-link'
      }, [
        Dom.createElement('span', {
          className: 'glyphicon glyphicon-edit'
        })
      ], onEditEvent),
      Dom.createElement('button', {
        type: 'button',
        className: 'btn btn-link'
      }, [
        Dom.createElement('span', {
          className: 'glyphicon glyphicon-remove'
        })
      ], onRemoveEvent)
    ]));

    element = Dom.createElement('tr', null, row);
    if (oldNode) {
      Dom.update(oldNode, element);
    } else {
      Dom.render(
        element,
        grid._body
      );
      if (isNewRow) grid.editRow(element, dataRow);
    }

  };

  GridView.prototype.removeRow = function(positionOfRow, dataRow) {
    console.log('Remove ' + dataRow);
    var isConfirm = confirm('Really?');
    if (isConfirm === true) Dom.remove(positionOfRow);

  }

  GridView.prototype.editRow = function(positionOfRow, dataRow) {
    var grid = this;

    for (var i = 0; i < positionOfRow.cells.length; i++) {
      var cell = positionOfRow.cells[i];
      if (cell.className.indexOf('rowValue') !== -1) {
        console.log('Editing cell ' + cell.innerHTML);
        toEditable(cell);
      } else {
        changeBehavior(cell);
      }
    }

    function toEditable(element) {
      var dataIndex = element.id;
      element.innerHTML = '';
      Dom.render(Dom.createElement('input', {
        type: 'text',
        className: 'form-control',
        id: dataIndex,
        value: dataRow[dataIndex]
      }), element);
    }

    function changeBehavior(element) {
      element.innerHTML = '';
      Dom.render(Dom.createElement('td', null, [
        Dom.createElement('button', {
          type: 'button',
          className: 'btn btn-link'
        }, [
          Dom.createElement('span', {
            className: 'glyphicon glyphicon-ok'
          })
        ], onClickDone),
        Dom.createElement('button', {
          type: 'button',
          className: 'btn btn-link'
        }, [
          Dom.createElement('span', {
            className: 'glyphicon glyphicon-remove'
          })
        ], onClickCancel)
      ]), element);

      function onClickDone() {
        try {
          grid.updateRow(dataRow, getNewRow(dataRow, positionOfRow), positionOfRow);
        } catch (e) {
          alert(e);
        }
      }

      function getNewRow(oldDataRow, positionOfRow) {
        var newDataRow = oldDataRow;
        var inputs = positionOfRow.getElementsByTagName('input');
        console.log('Number of input : ' + inputs.length);
        for (var i = 0; i < inputs.length; i++) {
          var cell = inputs[i];
          var dataIndex = cell.id;
          if (cell.value === "" || cell.value === null) throw 'Input do not empty! --> ' + dataIndex;

          if (typeof newDataRow[dataIndex] === 'number') {
            var number = parseInt(cell.value);
            if (isNaN(number)) throw 'Input illegal at ' + dataIndex;
            newDataRow[dataIndex] = number;
          } else {
            newDataRow[dataIndex] = cell.value;
          }

          console.log(newDataRow[dataIndex]);
        }

        return newDataRow;
      }

      function onClickCancel() {
        grid.updateRow(dataRow, dataRow, positionOfRow);
      }
    }
  }

  GridView.prototype.updateRow = function(oldDataRow, newDataRow, positionOfRow) {
    var indexOfRow = this.indexOf(oldDataRow);
    if (indexOfRow != -1) {
      this._dataSource[indexOfRow] = newDataRow;
      this.addRow(newDataRow, positionOfRow);
    }
  }

  GridView.prototype.indexOf = function(dataRow) {
    return this._dataSource.indexOf(dataRow);
  }

  GridView.prototype.sortData = function(indexData) {
    if (typeof this._dataSource[indexData] === 'number') {
      this._dataSource.sort(sortBy(indexData, true, parseInt));
    } else {
      this._dataSource.sort(sortBy(indexData, true, function(a) {
        return a;
      }));
    }

    console.log('asdsa');
    Dom.clear(this._body);
    this.loadData(this._dataSource);
  }

  var sortBy = function(field, reverse, primer) {

    var key = primer ?
      function(x) {
        return primer(x[field])
      } :
      function(x) {
        return x[field]
      };

    reverse = !reverse ? 1 : -1;

    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
  }



  return GridView;

})();
