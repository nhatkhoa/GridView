(function() {
  'use strict';

  var ajax = new Ajax({
    getEmployeesUrl: '/employees/',
    getDepartmentsUrl: '/departments/',
    addUrl: '/employees/'
  });

  var departments = [];
  var employees = [];

  function onAddedRow(event) {
    console.log(event);
  }

  var grid = new Grid({
    isShowHeader: true,
    isShowEditButton: true,
    isShowAddButton: true,

    onAddedRow: onAddedRow,

    title: 'Employees Manager',
    addButton: 'Add New Employee',
    tableClass: 'table table-hover table-custom',
    bodyClass: 'tableBody',
    panelHeaderClass: 'panel-header',
    panelBodyClass: 'panel-body',
    panelFooterClass: 'panel-footer',

    columns: [{
      title: 'ID',
      flexWidth: 1,
      dataIndex: 'id',
      editable: false
    }, {
      title: 'Name',
      flexWidth: 2,
      dataIndex: 'name',
      editable: true,
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
          src: employees[rowIndex]['gender'] ? 'assets/man.png' : 'assets/img.jpg'
        })]);
      }
    }, {
      title: 'Age',
      flexWidth: 1,
      dataIndex: 'age',
      editable: true,
      nullable: false
    }, {
      title: 'Department',
      flexWidth: 2,
      dataIndex: 'department',
      editable: true,
      fieldTemplate: function(value, rowIndex) {
        var name = 'None';
        for (var i = 0; i < departments.length; i++) {

          if (departments[i].id === value)
            name = departments[i].name;
        };

        return name;
      },
      editTemplate: function(value, rowIndex) {
        var selectOptions = [];

        for (var i = 0; i < departments.length; i++) {

          selectOptions.push(Dom.createElement('option', {
            value: departments[i].id,
            selected: (value === departments[i].id)
          }, [departments[i].name]));
        };
        return Dom.createElement('select', {
          className: 'form-control select-department'
        }, selectOptions);
      },
      getEditValue: function(targetDom) {
        var select = document.querySelector('.select-department');

        return select.value || 0;
      }
    }, {
      title: 'Gender',
      flexWidth: 1,
      dataIndex: 'gender',
      editable: true,
      fieldTemplate: function(value, indexRow) {

        return Dom.createElement('h1', {
          className: value ? 'fa fa-male' : 'fa fa-female'
        });
      },
      editTemplate: function(value) {

        return Dom.createElement('input', {
          type: 'checkbox',
          className: 'check-gender',
          checked: value || false
        });
      },
      getEditValue: function(targetDom) {
        var select = document.querySelector('.check-gender');
        return select ? select.checked : undefined;
      }
    }],

    renderTo: document.getElementById('grid')
  });

  ajax.getDepartments(function(data) {
    departments = data;

  });

  ajax.getEmployees(function(data) {
    employees = data;
    grid.init(employees);
  });


})();
