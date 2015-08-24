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

  Grid.prototype = {
    CSS_ROW_PREFIX: 'data-row-',
    CSS_COL_PREFIX: 'data-col-',
    EDIT_COL_PREFIX: 'col-edit',
    BTN_EDIT_PREFIX: 'edit-',
    BTN_REMOVE_PREFIX: 'remove-',
    BTN_SAVE_PREFIX: 'save-',
    BTN_CANCEL_PREFIX: 'cancel-',
    _editingPosition: -1,

    init: function() {

      this._render();
      this._addListener(this._getBodyPosition());

    },

    _render() {

      this._renderLayout();

      if (this.isShowHeader()) this._renderHeader();

      this._renderRows();

    },

    _addListener(parent) {

      var grid = this,
        currentHoverRow = -1,
        cssRowPrefix = grid.CSS_ROW_PREFIX,
        cssColPrefix = grid.CSS_COL_PREFIX,
        editPrefix = grid.BTN_EDIT_PREFIX,
        removePrefix = grid.BTN_REMOVE_PREFIX,
        savePrefix = grid.BTN_SAVE_PREFIX,
        cancelPrefix = grid.BTN_CANCEL_PREFIX,
        callBackFn = grid._eventCallback.bind(grid);

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
            var rowIndex = indexButton.substr(removePrefix.lenght);

            grid.removeRow(rowIndex);
          }

          // TODO : save change with custom edit template
          // Click on button save change row
          if (indexButton.indexOf(savePrefix) !== -1) {
            var rowIndex = indexButton.substr(savePrefix.lenght);
            console.log('Save change row ' + rowIndex);
          }

          // TODO : refresh row
          // Click on button cancel change row
          if (indexButton.indexOf(cancelPrefix) !== -1) {
            var rowIndex = indexButton.substr(cancelPrefix.lenght);
            console.log('Cancel edit row ' + rowIndex);
            grid.removeRow(rowIndex);
          }

        } catch (e) {
          alert(e);
          throw e;
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
    },

    isShowHeader: function() {
      return this.options.isShowHeader !== undefined ? this.options.isShowHeader : true;
    },
    isShowEditButton: function() {
      return this.options.isShowEditButton !== undefined ? this.options.isShowEditButton : true;
    },
    isShowAddButton: function() {
      return this.options.isShowAddButton !== undefined ? this.options.isShowAddButton : true;
    },

    // TODO : when click add row
    addNewRow: function() {

    },

    editRow: function(row) {
      console.log("Edit row");
      var cssRowPrefix = this.CSS_ROW_PREFIX;
      var cssColPrefix = this.CSS_COL_PREFIX;
      var cssBtnEdit = this.EDIT_COL_PREFIX;
      var grid = this;

      if (this._editingPosition !== -1) throw ('Please complete editing row first.');
      this._editingPosition = row;

      var fields = document.querySelectorAll('.' + cssRowPrefix + row + ' > td');
      console.log('Edit ' + fields.length + ' field : ' + JSON.stringify(fields));

      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (field.className.indexOf(cssColPrefix) !== -1)
          this.editField(row, i, field);
        if (field.className.indexOf(cssBtnEdit) !== -1) {
          renderBtnSave(field);
        }
      }

      function renderBtnSave(target) {
        var btnDom = grid._getSaveButtonTemplate(row);
        Dom.update(btnDom, target);
      }

    },

    removeRow: function(rowIndex) {
      var confirm = window.confirm(this.options.removeMessage ? this.options.removeMessage : 'Please confirm that you really want to remove it.');
      var cssRowPrefix = this.CSS_ROW_PREFIX;
      if (confirm) {
        delete this._dataSource[rowIndex];
        this._getBodyPosition().querySelector(cssRowPrefix + rowIndex).remove();
      }

    },
    updateRow: function() {

    },

    editField: function(rowIndex, columnIndex, fieldDom) {
      console.log('Get edit template of ' + fieldDom.outerHTML);
      var column = this.options.columns[columnIndex];
      var fieldTemplate = this._getEditFieldTemplate(rowIndex, columnIndex);

      if (fieldTemplate) {
        Dom.update(fieldTemplate, fieldDom);
      }

    },


    _renderHeader: function() {
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
    },

    // TODO : Can render custom layout instead of default
    _renderLayout: function() {



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
    },

    // TODO : Render with customs number of row
    _renderRows: function() {
      Dom.clear(this._getBodyPosition());

      for (var index = 0; index < this._dataSource.length; ++index) {
        this._renderRow(index, this._dataSource[index]);
      }
    },

    // Render new row or replace old row in grid.
    _renderRow: function(rowIndex, dataRow) {

      var cssRowPrefix = this.CSS_ROW_PREFIX;
      var columns = this.options.columns;

      // Query select if that row was created.
      var existedRow = document.querySelector('.' + cssRowPrefix + rowIndex);

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
    },

    _renderEditRow: function(rowIndex) {
      var rowContainer = {};
      var fields = [];

      var columns = this.options.columns;
      for (var columnIndex = 0; columnIndex < columns.length; ++columnIndex) {
        fields.push(this._getEditFieldTemplate(rowIndex, columns[columnIndex]));
      }

      rowContainer = Dom.createElement('tr', null, fields);

      Dom.render(
        rowContainer,
        this._getBodyPosition()
      );
    },

    // TODO : header title with sort and filter button.
    _getHeadFieldTemplate: function() {

    },

    // Get template default or custom template by user
    _getRowFieldTemplate: function(row, col) {
      var cssColPrefix = this.CSS_COL_PREFIX;
      var colOption = this._getColOption(col);
      var dataIndex = colOption.dataIndex;
      var value = dataIndex ? this._getValue(row, dataIndex) : '';
      var fieldTemplate = colOption.fieldTemplate;
      var field = undefined;

      if (!fieldTemplate) field = String(value);

      if (typeof fieldTemplate === 'function') field = fieldTemplate(value, row);

      if (field === undefined) throw ('Field template must be a function -->' + JSON.stringify(colOption));

      return Dom.createElement('td', {
        className: cssColPrefix + col
      }, [field]);

    },

    _getColOption: function(columnIndex) {
      var column = this.options.columns[columnIndex];
      if (!column) throw ('Out of column option list at ' + columnIndex);
      return column;
    },

    _getDataIndex: function(columnIndex) {
      var dataIndex = this._getColOption(columnIndex).dataIndex;
      if (!dataIndex) return 'none';
      return column;
    },

    // --- Get value of field which was customed template by user
    _getValue: function(row, dataIndex) {
      console.log('Get value data of row ' + row + ' col ' + dataIndex);
      var value = this._dataSource[row][dataIndex];
      if (value === 'undefined') throw ('There are no date value at row ' + row + ' col ' + dataIndex);
      return value;
    },

    // --- Get by default or customs template from user config
    _getEditFieldTemplate: function(row, col) {

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
    },

    _getEditValue: function(col, fieldDom) {
      var column = this.options.columns[col];
      var editable = column.editable
      if (!column.dataIndex) return;
      var getValFn = column.getEditValue;

      // if this field using defaut editor (input text)
      if (column.editTemplate === this.TEMPLATE_EDIT_STRING) {
        var input = field.getElementsByTagName('input')[0];
        if (input) {
          var value = input.value;
          if (!value || value.trim() === '')
            throw ('Input text can not empty.');

          console.log('new value is : ' + value);
          return value;
        }
      }

      if (getValFn && typeof getValFn === 'function') return getValFn(fieldDom);

      throw ('Can not edit this field.');

    },

    // TODO : Option col summary
    _getFootTemplate: function() {

    },

    _getEditButtonTemplate: function(row) {

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

    },

    _getSaveButtonTemplate: function(row) {

      return Dom.createElement('td', {
        className: this.EDIT_COL_PREFIX
      }, [
        Dom.createElement('button', {
          type: 'button',
          className: 'btn btn-link',
          id: this.BTN_SAVE_PREFIX + row
        }, [
          Dom.createElement('span', {
            className: 'glyphicon glyphicon-ok-circle icon-green'
          })
        ]),
        Dom.createElement('button', {
          type: 'button',
          className: 'btn btn-link',
          id: this.BTN_CANCEL_PREFIX + row
        }, [
          Dom.createElement('span', {
            className: 'glyphicon glyphicon-refresh icon-red'
          })
        ])
      ])
    },

    _getBodyPosition: function() {
      return this.options.renderTo.querySelector('tbody');
    },


    _getHeaderPosition: function() {
      return this._header = this.options.renderTo.querySelector('thead');
    },


    /* TODO
    onRowEdited: onRowEdited
    onRowRendered: onRowRendered
    onRowClicked: onRowClicked
    onRowDoubleClicked: onRowDoubleClicked
    onRowRemoved: onRowRemoved
    onRowAdded: onRowAdded

     */
    _eventCallback: function(event) {
      var callback = this.options[event.type];

      if (callback && typeof callback === 'function')
        callback.call(this, event);
    }

  }

  return Grid;

})();
