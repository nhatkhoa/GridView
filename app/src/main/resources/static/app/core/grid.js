// Copyright (c) 2015 Kms-technology.com
var Grid = (function() {

  'use strict';

  var CSS_ROW_PREFIX = 'data-row-',
    CSS_COL_PREFIX = 'data-col-',
    EDIT_COL_PREFIX = 'col-edit',
    BTN_EDIT_PREFIX = 'edit-',
    BTN_REMOVE_PREFIX = 'remove-',
    BTN_SAVE_PREFIX = 'save-',
    BTN_CANCEL_PREFIX = 'cancel-',
    BTN_SORT_PREFIX = 'sort-';


  function Grid(options) {
    this.options = options || {};
    if (!this.options.renderTo) {
      this.options.renderTo = document.body;
    }

    this._dataSource = this.options.dataSource;

    this.editingPosition = -1;
    this.currentHoverRow = -1;
    this.isAddingNewRow = false;
  }

  Object.defineProperty(Grid, 'options', {
    get: function() {
      return this._options;
    },
    set: function(options) {
      this._options = options;
    }
  });



  function getRowIndex(target) {
    while (target.className.indexOf(CSS_ROW_PREFIX) === -1) {
      target = target.parentNode;
      if (!target || target.nodeName === 'BODY') return;
    }
    return target.className.substr(CSS_ROW_PREFIX.length);
  }

  function getColIndex(target) {
    while (target.className.indexOf(CSS_COL_PREFIX) === -1) {
      target = target.parentNode;
      if (!target || target.nodeName === 'BODY') return;
    }
    return target.className.substr(CSS_COL_PREFIX.length);
  }

  function getColOption(col) {
    var column = this.options.columns[col];
    if (!column) throw ('Out of column option list at ' + col);
    return column;
  }

  // TODO : header title with sort and filter button.
  function getHeadFieldTemplate() {

  }

  function getDataIndex(columnIndex) {
    var dataIndex = getColOption(columnIndex).dataIndex;
    if (!dataIndex) return 'none';
    return column;
  }


  Grid.prototype.render = function() {
    if (!this.options.body) this.renderLayout();
    if (this.isShowHeader && !this.options.body) this.renderHeader();
    this.renderRows();
  };

  Grid.prototype.init = function(dataSource) {
    this._dataSource = dataSource || {};

    console.log('inti data');
    if (!this._dataSource || this._dataSource.length === 0) {
      console.error('Datasource is empty.');
      throw 'DataSource can not empty, please check your configurations.';
    }


    var callbackFn = this.eventCallback.bind(this);
    var grid = this;
    this.render();

    // Add event listener default for gridview.

    this.addEventListener('click', onBtnClick.bind(this));
    this.addEventListener('click', onRowClick);
    this.addEventListener('dblclick', onRowDbClick);
    this.addEventListener('mouseover', onRowHover);

    function onBtnClick(target) {

      var btnId = target.id || target.parentNode.id || '';

      function checkType(prefix) {
        return btnId.indexOf(prefix) !== -1;
      }

      function getRow(prefix) {
        return btnId.substr(prefix.length);
      }

      if (checkType(BTN_EDIT_PREFIX)) this.editRow(getRow(BTN_EDIT_PREFIX));
      if (checkType(BTN_REMOVE_PREFIX)) this.removeRow(getRow(BTN_REMOVE_PREFIX));
      if (checkType(BTN_SAVE_PREFIX)) this.saveChange();
      if (checkType(BTN_CANCEL_PREFIX)) this.cancelEdit();
      if (checkType(BTN_SORT_PREFIX)) {

        this.sortByColumn(getRow(BTN_SORT_PREFIX));
      }

    }

    function getEventData(target) {
      var event = {};
      event.row = getRowIndex(target);
      event.col = getColIndex(target);
      event.target = target;
      return event;
    }


    function onRowClick(target) {
      var event = getEventData(target);
      event.type = 'onRowClicked';

      return callbackFn(event);
    }

    function onRowDbClick(target) {
      var event = getEventData(target);
      event.type = 'onRowDoubleClicked';

      return callbackFn(event);
    }

    function onRowHover(target) {
      var event = getEventData(target);
      event.type = 'onRowHover';

      return callbackFn(event);
    }
  };

  Grid.prototype.addEventListener = function(type, callback) {
    var node = this.options.renderTo;

    node.addEventListener(type, callbackfn.bind(this));

    function callbackfn() {
      var e = event || window.event;
      var target = e.target || e.srcElement;

      e.stopPropagation();
      return callback.call(this, target);
    }
  };

  Grid.prototype.cancelEdit = function() {
    var row = this.editingPosition;
    console.log('Cancel edit ' + row);
    if (this.isAddingNewRow) {

      delete this._dataSource[row];
      this.getRowTarget(row).remove();

      this.isAddingNewRow = false;

    } else {
      this.renderRow(row, this._dataSource[row]);
    }

    this.editingPosition = -1;
  };

  Grid.prototype.isShowHeader = function() {
    return this.options.isShowHeader || true;
  };

  Grid.prototype.isShowEditButton = function() {
    return this.options.isShowEditButton || true;
  };

  Grid.prototype.isShowAddButton = function() {
    return this.options.isShowAddButton || true;
  };

  Grid.prototype.addNewRow = function() {
    if (this.isAddingNewRow) return;
    var newRow = {};
    for (var i = 0; i < this.options.columns.length; i++) {
      var col = getColOption.call(this, i);
      var dataIndex = col.dataIndex;
      if (!dataIndex) continue;
      var type = col.dataType || 'string';
      switch (type) {
        case 'number':
          newRow[dataIndex] = 0;
          break;
        case 'boolean':
          newRow[dataIndex] = false;
          break;
        default:
          newRow[dataIndex] = '';
          break;
      }
    };

    this._dataSource.push(newRow);
    this.renderRow(this._dataSource.length - 1, newRow);
    this.editRow(this._dataSource.length - 1);
    this.isAddingNewRow = true;
  };

  Grid.prototype.saveChange = function() {
    var callbackFn = this.eventCallback.bind(this);

    var row = this.editingPosition,
      editingRow = this.getRowTarget(row);

    if (!editingRow) throw ('Something go to wrong with Edit Feature --> editing row : ' + row);

    var fields = editingRow.querySelectorAll('td');

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.className.indexOf(CSS_COL_PREFIX) !== -1) {
        var col = parseInt(field.className.substr(CSS_COL_PREFIX.length));
        var value = this.getEditValue(col, field);

        if (value !== undefined) {
          var column = this.options.columns[col];
          var dataIndex = column.dataIndex;
          switch (column.dataType) {
            case 'number':
              value = parseInt(value);
              break;
            case 'boolean':
              value = Boolean(value);
              break;
            default:
              value = String(value);
              break;
          }
          this._dataSource[row][dataIndex] = value;
        }
      }
    }

    this.renderRow(row, this._dataSource[row]);
    this.editingPosition = -1;

    // Call even on added row
    if (this.isAddingNewRow) {
      var event = {};
      event.dataRow = this._dataSource[row];
      event.rowIndex = row;
      callbackFn(event);
    }

    this.isAddingNewRow = false;
  };

  Grid.prototype.editRow = function(row) {
    if (this.editingPosition !== -1) throw ('Please complete editing row ' + (+this.editingPosition + 1) + ' first.');
    this.editingPosition = row;
    var fields = document.querySelectorAll('.' + CSS_ROW_PREFIX + row + ' > td');

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.className.indexOf(CSS_COL_PREFIX) !== -1)
        this.renderEditField(row, i, field);
      if (field.className.indexOf(EDIT_COL_PREFIX) !== -1) {
        renderBtnSave.call(this, field);
      }
    }

    //FIX
    function renderBtnSave(target) {
      var btnSaveChanges = this.getSaveButtonTemplate(row);
      Dom.updates(btnSaveChanges, target);
    }

  };

  Grid.prototype.removeRow = function(rowIndex) {
    if (this.editingPosition !== -1) return;
    var confirm = window.confirm(this.options.removeMessage ? this.options.removeMessage : 'Please confirm that you really want to remove it.');
    if (confirm) {
      delete this._dataSource[rowIndex];
      this.getRowTarget(rowIndex).remove();
    }
  };


  Grid.prototype.renderEditField = function(rowIndex, columnIndex, fieldDom) {
    var column = this.options.columns[columnIndex];
    var fieldTemplate = this.getEditFieldTemplate(rowIndex, columnIndex);

    if (fieldTemplate) {
      Dom.update(fieldTemplate, fieldDom);
    }

  };


  Grid.prototype.renderHeader = function() {
    var headers = [];

    for (var i = 0; i < this.options.columns.length; ++i) {
      var colOption = getColOption.call(this, i);
      var headerName = colOption.title;
      var flexWidth = colOption.flexWidth;
      var dataIndex = colOption.dataIndex;
      var flexWidth = ' col-lg-' + flexWidth + ' col-sm-' + flexWidth + ' col-xs-' + flexWidth;
      if (dataIndex) {
        var btnSort = Dom.createElement('button', {
          className: 'btn btn-link ',
          id: BTN_SORT_PREFIX + i
        }, [Dom.createElement('i', {
          className: 'glyphicon glyphicon-arrow-down'
        })]);

        headers.push(Dom.createElement('th', {
          className: flexWidth
        }, [
          Dom.createElement('span', null, [headerName]),
          btnSort
        ]));
      } else {
        headers.push(Dom.createElement('th', {
          className: flexWidth
        }, [headerName]));
      }

    }

    if (this.isShowEditButton()) headers.push(Dom.createElement('th', null, ['']));


    Dom.render(Dom.createElement('tr', null, headers), this.getHeaderPosition());
  };

  // TODO : Can render custom layout instead of default
  Grid.prototype.renderLayout = function() {



    Dom.render(
      Dom.createElement('div', {
        className: this.options.panelClass ? this.options.panelClass : 'panel panel-default'
      }, [
        Dom.createElement('div', {
          className: this.options.panelHeadingClass ? this.options.panelHeadingClass : 'panel-heading'
        }, [
          Dom.createElement('div', {
            className: this.options.panelTitleClass ? this.options.panelTitleClass : 'panel-title'
          }, [
            Dom.createElement('h3', null, [
              Dom.createElement('label', null, [this.options.title ? this.options.title : 'Sample Grid Control'])
            ])
          ])
        ]),
        Dom.createElement('div', {
          className: this.options.panelBodyClass ? this.options.panelBodyClass : 'panel-body'
        }, [
          Dom.createElement('table', {
            className: this.options.tableClass ? this.options.tableClass : 'table table-hover table-fixed'
          }, [
            Dom.createElement('thead', {
              className: this.options.headClass
            }),
            Dom.createElement('tbody', {
              className: this.options.bodyClass
            })
          ])
        ]),
        Dom.createElement('div', {
          className: this.options.panelFooterClass ? this.options.panelFooterClass : 'panel-footer'
        }, this.isShowAddButton() ? [
          Dom.createElement('button', {
            type: 'button',
            className: 'btn btn-default'
          }, [this.options.addButton || 'Add Row'], onAddRowClick.bind(this))
        ] : [])
      ]),
      this.options.renderTo
    );


    function onAddRowClick() {
      this.addNewRow();
    }
  };

  // TODO : Render with customs number of row
  Grid.prototype.renderRows = function() {
    Dom.clear(this.getBodyPosition());

    for (var index = 0; index < this._dataSource.length; ++index) {
      this.renderRow(index, this._dataSource[index]);
    }
  };

  // Render new row or replace old row in grid.
  Grid.prototype.renderRow = function(row, dataRow) {
    var columns = this.options.columns;

    // Query select if that row was created.
    var existedRow = this.getRowTarget(row);

    if (existedRow) {
      Dom.updates(getRowTemplate.call(this), existedRow);
    } else {
      var rowContainer = {};
      rowContainer = Dom.createElement('tr', {
        className: CSS_ROW_PREFIX + row
      }, getRowTemplate.call(this));

      Dom.render(
        rowContainer,
        this.getBodyPosition()
      );
    }

    function getRowTemplate() {

      var fields = [];
      for (var columnIndex = 0; columnIndex < columns.length; ++columnIndex) {
        fields.push(this.getRowFieldTemplate(row, columnIndex));
      }
      if (this.isShowEditButton()) fields.push(this.getEditButtonTemplate(row));
      return fields;
    }
  };


  Grid.prototype.getRowTarget = function(rowIndex) {
    return this.getBodyPosition().querySelector('.' + CSS_ROW_PREFIX + rowIndex);
  };

  // --- Get template default or custom template by user
  Grid.prototype.getRowFieldTemplate = function(row, col) {
    var colOption = getColOption.call(this, col),
      dataIndex = colOption.dataIndex,
      value = dataIndex ? this.getValue(row, dataIndex) : '',
      fieldTemplate = colOption.fieldTemplate,
      field = undefined;

    if (!colOption.dataType) {
      this.options.columns[col].dataType = typeof value;
    }

    if (!fieldTemplate) field = String(value);

    if (typeof fieldTemplate === 'function') field = fieldTemplate(value, row);

    if (field === undefined) throw ('Field template must be a function -->' + JSON.stringify(colOption));

    return Dom.createElement('td', {
      className: CSS_COL_PREFIX + col
    }, [field]);

  };



  // --- Get value of field which was customed template by user
  Grid.prototype.getValue = function(row, dataIndex) {

    var value = this._dataSource[row] ? this._dataSource[row][dataIndex] : undefined;

    if (value === 'undefined') throw ('There are no date value at row ' + row + ' col ' + dataIndex);
    return value;
  };

  // --- Get by default or customs template from user config
  Grid.prototype.getEditFieldTemplate = function(row, col) {

    var colOption = getColOption.call(this, col);
    var editable = colOption.editable !== undefined ? colOption.editable : false;
    if (!editable) return;

    var dataIndex = colOption.dataIndex;
    if (!dataIndex) throw ('Field editable must be have data index on config -->> ' + JSON.stringif(colOption));

    var value = this._dataSource[row][dataIndex];
    if (value === undefined) throw ('Value at [' + row + '][' + dataIndex + '] is not exist, please check your config.');

    var type = getType(typeof value);

    function getType(type) {
      switch (type) {
        case 'string':
          return 'text';
        case 'number':
          return 'number';
        case 'datetime':
          return 'datetime';
        default:
          return 'text';
      }
    }
    var editTemplate = colOption.editTemplate;

    if (!editTemplate) {

      return Dom.createElement('input', {
        type: type,
        className: 'form-control',
        value: value,
        placeholder: 'Enter value.',
        required: true
      });
    }

    if (editTemplate && typeof editTemplate === 'function') {
      return Dom.createElement('td', {
        row: row,
        field: dataIndex
      }, [editTemplate(value, row)]);
    }

    throw ('Can not render field ' + JSON.stringify(colOption));
  };

  Grid.prototype.getEditValue = function(col, fieldDom) {
    var column = this.options.columns[col];
    var editable = column.editable
    if (!column.dataIndex && !editable) return;
    var getValFn = column.getEditValue;

    console.log(' Get value ' + getValFn + ' ' + col);
    // if this field using defaut editor (input text)
    if (!getValFn) {
      var input = fieldDom.getElementsByTagName('input')[0];
      if (input) {
        var value = input.value;
        // Check nullable of config this column
        var nullable = column.nullable !== undefined ? column.nullable : true;
        if (!nullable && (!value || value.trim() === '')) {
          fieldDom.className += ' has-feedback has-error';
          throw ('Input ' + column.title + ' can not empty.');
        }

        return value;
      }
    }

    if (getValFn && typeof getValFn === 'function') return getValFn(fieldDom);

    throw ('Can not edit this field.');

  };

  // TODO : Option col summary
  Grid.prototype.getFootTemplate = function() {

  };

  Grid.prototype.getEditButtonTemplate = function(row) {

    return Dom.createElement('td', {
      className: EDIT_COL_PREFIX
    }, [
      Dom.createElement('button', {
        type: 'button',
        className: 'btn btn-link',
        id: BTN_EDIT_PREFIX + row
      }, [
        Dom.createElement('span', {
          className: 'glyphicon glyphicon-edit icon-black'
        })
      ]),
      Dom.createElement('button', {
        type: 'button',
        className: 'btn btn-link',
        id: BTN_REMOVE_PREFIX + row
      }, [
        Dom.createElement('span', {
          className: 'glyphicon glyphicon-remove icon-red'
        })
      ])
    ]);

  };

  Grid.prototype.getSaveButtonTemplate = function(row) {

    var buttons = [];

    buttons.push(Dom.createElement('button', {
      type: 'button',
      className: 'btn btn-link',
      id: BTN_SAVE_PREFIX + row
    }, [
      Dom.createElement('span', {
        className: 'glyphicon glyphicon-ok-circle icon-green'
      })
    ]));
    buttons.push(Dom.createElement('button', {
      type: 'button',
      className: 'btn btn-link',
      id: BTN_CANCEL_PREFIX + row
    }, [
      Dom.createElement('span', {
        className: 'glyphicon glyphicon-refresh icon-red'
      })
    ]));

    return buttons;
  };

  Grid.prototype.getBodyPosition = function() {

    return this.options.body || this.options.renderTo.querySelector('tbody');
  };

  Grid.prototype.getHeaderPosition = function() {
    return this.options.renderTo.querySelector('thead');
  };


  Grid.prototype.eventCallback = function(event) {
    var callback = this.options[event.type];

    if (callback && typeof callback === 'function')
      callback.call(this, event);
  };

  Grid.prototype.sortByColumn = function(col) {
    if (this.editingPosition !== -1) return;

    var colOption = getColOption.call(this, col);
    var dataIndex = colOption.dataIndex;
    if (!dataIndex) return;

    this._dataSource.sort(sort.bind(this));
    this.renderRows();

    tongleState.call(this);

    function getState() {
      if (colOption.sortReverse === undefined) {
        this.options.columns[col].sortReverse = false;
        return false;
      }
      return this.options.columns[col].sortReverse;
    }

    function tongleState() {
      var state = getState.call(this);
      this.options.columns[col].sortReverse = !state;
      // --- Change btn icon
      var icon = this.options.renderTo.querySelector('#' + BTN_SORT_PREFIX + col + ' i');
      icon.className = state ? 'glyphicon glyphicon-arrow-down' : 'glyphicon glyphicon-arrow-up';
    }


    function sort(a, b) {
      var type = typeof a[dataIndex];

      function number(numA, numB) {

        return getState.call(this) ? numB - numA : numA - numB;
      }

      function string(strA, strB) {
        return getState.call(this) ? strB.localeCompare(strA) : strA.localeCompare(strB);
      }

      if (type === 'string') return string.call(this, a[dataIndex], b[dataIndex]);
      if (type === 'number') return number.call(this, a[dataIndex], b[dataIndex]);
    }
  };

  return Grid;

})();
