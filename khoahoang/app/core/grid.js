//TODO :
/**
 * + Lazy loading
 * + Added event for user
 * + Flexible custom layout
 * + Sort feature
 * + Filter row
 * + Custom Summary or Avg on footer
 */

// NOTE : Some event is tested on console.
var Grid = (function() {

  'use strict';

  var CSS_ROW_PREFIX = 'data-row-',
    CSS_COL_PREFIX = 'data-col-',
    EDIT_COL_PREFIX = 'col-edit',
    BTN_EDIT_PREFIX = 'edit-',
    BTN_REMOVE_PREFIX = 'remove-',
    BTN_SAVE_PREFIX = 'save-',
    BTN_CANCEL_PREFIX = 'cancel-';

  var editingRow = -1,
    currentHoverRow = -1;

  function Grid(options) {
    this.options = options || {};
    if (!this.options.renderTo) {
      this.options.renderTo = document.body;
    }

    this._dataSource = this.options.dataSource;

    if (!this._dataSource || this._dataSource.length === 0) {
      console.error('Datasource is empty.');
      throw 'DataSource can not empty, please check your configurations.';
    }

  }

  Object.defineProperty(Grid, 'options', {
    get: function() {
      return this._options;
    },
    set: function(options) {
      this._options = options;
    }
  });

  function getRowTarget(rowIndex) {
    var cssRowPrefix = this.CSS_ROW_PREFIX;
    return this._getBodyPosition().querySelector('.' + cssRowPrefix + rowIndex);
  }

  function getRowIndex(target) {
    while (target.className.indexOf(cssRowPrefix) === -1) {
      target = target.parentNode;
      if (target.nodeName === 'BODY') throw ('Your cursor is out of row.');
    }
    return target.className.substr(cssRowPrefix.length);
  }

  function getColIndex(target) {
    while (target.className.indexOf(cssColPrefix) === -1) {
      target = target.parentNode;
      if (target.nodeName === 'BODY') throw ('Your cursor is out of field.');
    }
    return target.className.substr(cssColPrefix.length);
  }

  function getColOption: function(columnIndex) {
    var column = this.options.columns[columnIndex];
    if (!column) throw ('Out of column option list at ' + columnIndex);
    return column;
  }

  // TODO : header title with sort and filter button.
  function getHeadFieldTemplate: function() {

  }

  function getDataIndex: function(columnIndex) {
    var dataIndex = this._getColOption(columnIndex).dataIndex;
    if (!dataIndex) return 'none';
    return column;
  }



  Grid.prototype.render = function(isShowHeader) {
    this.renderLayout();
    if (isShowHeader) this.renderHeader();
    this.renderRows();
  };

  Grid.prototype.init = function() {
    this.render(this.isShowHeader());
    this.addListener(this._getBodyPosition());
  };

  Grid.prototype.addEventListener = function(type, callback, parent) {
    var grid = this;



    function addListener(type, callback, parent) {
      var callBackFn = grid._eventCallback.bind(grid);



      //Event: Onclick
      parent.addEventListener('click', function() {
        var e = event || window.event,
          target = e.target || e.srcElement,
          indexButton = target.id || target.parentNode.id;

        try {

          // Click on button edit row
          if (indexButton.indexOf(editPrefix) !== -1) {
            var rowIndex = indexButton.substr(editPrefix.length);

            grid.editRow(rowIndex);
          }

          // Click on button remove row
          if (indexButton.indexOf(removePrefix) !== -1) {
            var rowIndex = indexButton.substr(removePrefix.length);

            grid.removeRow(rowIndex);
          }

          // TODO : save change with custom edit template
          // Click on button save change row
          if (indexButton.indexOf(savePrefix) !== -1) {
            var rowIndex = indexButton.substr(savePrefix.length);
            console.log('Save change row ' + rowIndex);
            grid.saveChange();

          }

          // Click on button cancel change row
          if (indexButton.indexOf(cancelPrefix) !== -1) {
            var rowIndex = indexButton.substr(cancelPrefix.length);
            grid._editingPosition = -1;
            grid._renderRow(rowIndex, grid._dataSource[rowIndex]);
          }

        } catch (e) {
          alert(e);
          console.error(e);
        }
        e.stopPropagation();

      });

      //Event: Double Click
      parent.addEventListener('dblclick', function() {
        var e = event || window.event
        var target = e.target || e.srcElement;
        e.stopPropagation();

        var indexColumn = getColIndex(target);
        var row = getRowIndex(target);
        console.log('Double click on row : ' + row + ' at column : ' + indexColumn);
        grid.editRow(row);
      });

      //Event: Focus row and field
      parent.addEventListener('mouseover', function() {
        var e = event || window.event
        var target = e.target || e.srcElement;
        e.stopPropagation();

        var row = getRowIndex(target);
        var col = getColIndex(target);

        callBackFn.call(this, {
          type: 'onFieldFocused',
          row: row,
          col: col
        });

        if (row !== currentHoverRow) {
          currentHoverRow = row;

          callBackFn.call(this, {
            type: 'onRowFocused',
            row: row,
            col: col
          });
        }

        e.stopPropagation();
      });


    }
  };

  Grid.prototype.isShowHeader: function() {
    return this.options.isShowHeader || true;
  };

  Grid.prototype.isShowEditButton: function() {
    return this.options.isShowEditButton || true;
  };

  Grid.prototype.isShowAddButton: function() {
    return this.options.isShowAddButton || true;
  };

  Grid.prototype.addNewRow: function() {
    var newRow = {};
    for (var i = 0; i < this.options.length; i++) {
      var col = this.options[i];
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
    this._renderRow(this._dataSource.length, newRow);
    this.editRow(this._dataSource.length);
  };

  Grid.prototype.saveChange: function() {
    var row = this._editingPosition,
      editingRow = this._getRowTarget(row),
      cssColPrefix = this.CSS_COL_PREFIX;

    if (!editingRow) throw ('Something go to wrong with Edit Feature --> editing row : ' + row);

    var fields = editingRow.querySelectorAll('td');

    console.log('Save change ' + fields.length + ' field : ' + JSON.stringify(fields));

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.className.indexOf(cssColPrefix) !== -1) {
        var col = parseInt(field.className.substr(cssColPrefix.length));
        console.log('Get value from field ' + col + ' of row ' + row);

        console.log('Catch col = ' + col);
        try {
          var value = this._getEditValue(col, field);

        } catch (e) {
          alert(e);
          console.log(e);
          return;
        }

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
          console.log(column.dataType);
          this._dataSource[row][dataIndex] = value;
        }
      }
    }

    this._renderRow(row, this._dataSource[row]);
    this._editingPosition = -1;
  };

  Grid.prototype.editRow: function(row) {

    var cssRowPrefix = this.CSS_ROW_PREFIX;
    var cssColPrefix = this.CSS_COL_PREFIX;
    var cssBtnEdit = this.EDIT_COL_PREFIX;
    var grid = this;

    if (this._editingPosition !== -1) throw ('Please complete editing row ' + (+this._editingPosition + 1) + ' first.');
    this._editingPosition = row;

    var fields = document.querySelectorAll('.' + cssRowPrefix + row + ' > td');
    console.log('Edit ' + fields.length + ' field : ' + JSON.stringify(fields));

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.className.indexOf(cssColPrefix) !== -1)
        this.renderEditField(row, i, field);
      if (field.className.indexOf(cssBtnEdit) !== -1) {
        renderBtnSave(field);
      }
    }

    //FIX
    function renderBtnSave(target) {
      var btnSaveChanges = grid._getSaveButtonTemplate(row);
      Dom.updates(btnSaveChanges, target);
    }

  };

  Grid.prototype.removeRow: function(rowIndex) {
    var confirm = window.confirm(this.options.removeMessage ? this.options.removeMessage : 'Please confirm that you really want to remove it.');
    if (confirm) {
      delete this._dataSource[rowIndex];
      this._getRowTarget(rowIndex).remove();
    }

  };


  Grid.prototype.renderEditField: function(rowIndex, columnIndex, fieldDom) {
    console.log('Get edit template of ' + fieldDom.outerHTML);
    var column = this.options.columns[columnIndex];
    var fieldTemplate = this._getEditFieldTemplate(rowIndex, columnIndex);

    if (fieldTemplate) {
      Dom.update(fieldTemplate, fieldDom);
    }

  };


  Grid.prototype.renderHeader: function() {
    var headers = [];
    for (var i = 0; i < this.options.columns.length; ++i) {
      var headerName = this.options.columns[i].title;
      var flexWidth = this.options.columns[i].flexWidth;
      var flexWidth = ' col-lg-' + flexWidth + ' col-sm-' + flexWidth + ' col-xs-' + flexWidth;

      headers.push(Dom.createElement('th', {
        className: flexWidth
      }, [headerName]));
    }

    if (this.isShowEditButton()) headers.push(Dom.createElement('th', null, ['']));


    Dom.render(Dom.createElement('tr', null, headers), this._getHeaderPosition());
  };

  // TODO : Can render custom layout instead of default
  Grid.prototype.renderLayout: function() {



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
          }, ['Add Row'])
        ] : [])
      ]),
      this.options.renderTo
    );
  };

  // TODO : Render with customs number of row
  Grid.prototype.renderRows: function() {
    Dom.clear(this._getBodyPosition());

    for (var index = 0; index < this._dataSource.length; ++index) {
      this._renderRow(index, this._dataSource[index]);
    }
  };

  // Render new row or replace old row in grid.
  Grid.prototype.renderRow: function(rowIndex, dataRow) {

    var cssRowPrefix = this.CSS_ROW_PREFIX;
    var columns = this.options.columns;

    // Query select if that row was created.
    var existedRow = this._getRowTarget(rowIndex);

    if (existedRow) {
      Dom.updates(getRowTemplate.call(this), existedRow);
    } else {
      var rowContainer = {};
      rowContainer = Dom.createElement('tr', {
        className: cssRowPrefix + rowIndex
      }, getRowTemplate.call(this));

      Dom.render(
        rowContainer,
        this._getBodyPosition()
      );
    }

    function getRowTemplate() {

      var fields = [];
      for (var columnIndex = 0; columnIndex < columns.length; ++columnIndex) {
        fields.push(this._getRowFieldTemplate(rowIndex, columnIndex));
      }
      if (this.isShowEditButton()) fields.push(this._getEditButtonTemplate(rowIndex));
      return fields;
    }
  };



  // Get template default or custom template by user
  Grid.prototype.getRowFieldTemplate: function(row, col) {
    var cssColPrefix = this.CSS_COL_PREFIX,
      colOption = this._getColOption(col),
      dataIndex = colOption.dataIndex,
      value = dataIndex ? this._getValue(row, dataIndex) : '',
      fieldTemplate = colOption.fieldTemplate,
      field = undefined;

    if (!colOption.dataType) {
      this.options.columns[col].dataType = typeof value;
      console.debug('Set type of field : ' + this.options.columns[col].dataType);
    }

    if (!fieldTemplate) field = String(value);

    if (typeof fieldTemplate === 'function') field = fieldTemplate(value, row);

    if (field === undefined) throw ('Field template must be a function -->' + JSON.stringify(colOption));

    return Dom.createElement('td', {
      className: cssColPrefix + col
    }, [field]);

  };



  // --- Get value of field which was customed template by user
  Grid.prototype.getValue: function(row, dataIndex) {
    console.log('Get value data of row ' + row + ' col ' + dataIndex);
    var value = this._dataSource[row][dataIndex];
    if (value === 'undefined') throw ('There are no date value at row ' + row + ' col ' + dataIndex);
    return value;
  };

  // --- Get by default or customs template from user config
  Grid.prototype.getEditFieldTemplate: function(row, col) {

    var colOption = this._getColOption(col);
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

  Grid.prototype.getEditValue: function(col, fieldDom) {
    var column = this.options.columns[col];
    var editable = column.editable
    if (!column.dataIndex) return;
    var getValFn = column.getEditValue;

    // if this field using defaut editor (input text)
    if (!getValFn) {
      var input = fieldDom.getElementsByTagName('input')[0];
      if (input) {
        var value = input.value;

        // Check nullable of config this column
        var nullable = column.nullable !== undefined ? column.nullable : true;
        if (!nullable && (!value || value.trim() === ''))
          throw ('Input ' + column.title + ' can not empty.');

        return value;
      }
    }

    if (getValFn && typeof getValFn === 'function') return getValFn(fieldDom);

    throw ('Can not edit this field.');

  };

  // TODO : Option col summary
  Grid.prototype.getFootTemplate: function() {

  };

  Grid.prototype.getEditButtonTemplate: function(row) {

    return Dom.createElement('td', {
      className: this.EDIT_COL_PREFIX
    }, [
      Dom.createElement('button', {
        type: 'button',
        className: 'btn btn-link',
        id: this.BTN_EDIT_PREFIX + row
      }, [
        Dom.createElement('span', {
          className: 'glyphicon glyphicon-edit icon-black'
        })
      ]),
      Dom.createElement('button', {
        type: 'button',
        className: 'btn btn-link',
        id: this.BTN_REMOVE_PREFIX + row
      }, [
        Dom.createElement('span', {
          className: 'glyphicon glyphicon-remove icon-red'
        })
      ])
    ]);

  };

  Grid.prototype.getSaveButtonTemplate: function(row) {

    var buttons = [];

    buttons.push(Dom.createElement('button', {
      type: 'button',
      className: 'btn btn-link',
      id: this.BTN_SAVE_PREFIX + row
    }, [
      Dom.createElement('span', {
        className: 'glyphicon glyphicon-ok-circle icon-green'
      })
    ]));
    buttons.push(Dom.createElement('button', {
      type: 'button',
      className: 'btn btn-link',
      id: this.BTN_CANCEL_PREFIX + row
    }, [
      Dom.createElement('span', {
        className: 'glyphicon glyphicon-refresh icon-red'
      })
    ]));

    return buttons;
  };

  Grid.prototype.getBodyPosition: function() {
    return this.options.renderTo.querySelector('tbody');
  };

  Grid.prototype.getHeaderPosition: function() {
    return this._header = this.options.renderTo.querySelector('thead');
  };

  Grid.prototype.eventCallback: function(event) {
    var callback = this.options[event.type];

    if (callback && typeof callback === 'function')
      callback.call(this, event);
  };

  return Grid;

})();
