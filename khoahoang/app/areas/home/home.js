(function() {
  'use strict';

  var countries = [{
    Name: '',
    Id: 0
  }, {
    Name: 'United States',
    Id: 1
  }, {
    Name: 'Canada',
    Id: 2
  }, {
    Name: 'United Kingdom',
    Id: 3
  }, {
    Name: 'France',
    Id: 4
  }, {
    Name: 'Brazil',
    Id: 5
  }, {
    Name: 'China',
    Id: 6
  }, {
    Name: 'Russia',
    Id: 7
  }];

  var clients = [{
    'Name': 'Otto Clay',
    'Age': 61,
    'Country': 6,
    'Address': 'Ap #897-1459 Quam Avenue',
    'Married': false
  }, {
    'Name': 'Connor Johnston',
    'Age': 73,
    'Country': 7,
    'Address': 'Ap #370-4647 Dis Av.',
    'Married': false
  }, {
    'Name': 'Lacey Hess',
    'Age': 29,
    'Country': 7,
    'Address': 'Ap #365-8835 Integer St.',
    'Married': false
  }, {
    'Name': 'Timothy Henson',
    'Age': 78,
    'Country': 1,
    'Address': '911-5143 Luctus Ave',
    'Married': false
  }, {
    'Name': 'Ramona Benton',
    'Age': 43,
    'Country': 5,
    'Address': 'Ap #614-689 Vehicula Street',
    'Married': true
  }];

  var home = this;

  var grid = new Grid({
    dataSource: clients,
    onRowHover: onRowHover,
    onRowEdited: onRowEdited,
    onRowClicked: onRowClicked,
    onRowDoubleClicked: onRowDoubleClicked,
    onRowRemoved: onRowRemoved,
    onRowAdded: onRowAdded,

    isShowHeader: true,
    isShowEditButton: true,
    isShowAddButton: true,

    title: 'Custom Title',
    addButton: 'Add New Client',
    tableClass: 'table table-hover table-custom',
    bodyClass: 'tableBody',
    panelHeaderClass: 'panel-header',
    panelBodyClass: 'panel-body',
    panelFooterClass: 'panel-footer',

    columns: [{

      title: '#',
      flexWidth: 1,
      editable: false,
      fieldTemplate: function(value, rowIndex) {
        return (rowIndex + 1).toString();
      }

    }, {
      title: 'Name',
      flexWidth: 2,
      dataIndex: 'Name',
      editable: 'true',
      nullable: false
    }, {
      title: 'Avatar',
      flexWidth: 1,
      editable: false,
      fieldTemplate: function(value, rowIndex) {
        return Dom.createElement('div', {
          className: 'img-thumbnail'
        }, [Dom.createElement('img', {
          className: 'img-responsive',
          alt: rowIndex,
          src: 'assets/img.jpg'
        })]);
      }
    }, {
      title: 'Age',
      flexWidth: 1,
      dataIndex: 'Age',
      editable: true,
      nullable: false
    }, {
      title: 'Country',
      flexWidth: 1,
      dataIndex: 'Country',
      editable: true,
      fieldTemplate: function(value, rowIndex) {
        return value ? countries[value].Name || 'none' : 'none';
      },
      editTemplate: function(value, rowIndex) {
        var selectOptions = [];

        for (var i = 1; i < countries.length; i++) {
          selectOptions.push(Dom.createElement('option', {
            value: countries[i].Id,
            selected: (value === countries[i].Id)
          }, [countries[i].Name]));
        };
        return Dom.createElement('select', {
          className: 'form-control select-countries'
        }, selectOptions);
      },
      getEditValue: function(targetDom) {
        var select = document.querySelector('.select-countries');
        return select.value || 0;
      }
    }, {
      title: 'Address',
      flexWidth: 3,
      dataIndex: 'Address',
      editable: true
    }, {
      title: 'Married',
      flexWidth: 1,
      dataIndex: 'Married',
      editable: true,
      fieldTemplate: function(value, indexRow) {
        if (value) return Dom.createElement('i', {
          className: 'glyphicon glyphicon-heart'
        });

        return '';
      },
      editTemplate: function(value) {
        console.log(value);
        return Dom.createElement('input', {
          type: 'checkbox',
          className: 'check-maried',
          checked: value || false
        });
      },
      getEditValue: function(targetDom) {
        var select = document.querySelector('.check-maried');
        return select ? select.checked : undefined;
      }
    }],

    renderTo: document.getElementById('grid')
  });

  function onRowHover(event) {
    //console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  function onRowEdited(event) {
    console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  function onRowRendered(event) {
    console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  function onRowClicked(event) {
    console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  function onRowDoubleClicked(event) {
    console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  function onRowRemoved(event) {
    console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  function onRowAdded(event) {
    console.info("Event " + event.type + ' on row ' + event.row + ' col ' + event.col);
  }

  grid.init();

})();
