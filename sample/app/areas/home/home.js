(function() {
  'use strict';

  var products = [
    { id: 'prod1', name: 'Product 1', desc: 'Product 1', price: 10000 },
    { id: 'prod2', name: 'Product 2', desc: 'Product 2', price: 20000 },
    { id: 'prod3', name: 'Product 3', desc: 'Product 3', price: 30000 },
    { id: 'prod4', name: 'Product 4', desc: 'Product 4', price: 40000 },
    { id: 'prod5', name: 'Product 5', desc: 'Product 5', price: 50000 }
  ];

  var grid = new GridView({
    columns: [{
      dataIndex: 'id',
      header: 'Id'
    }, {
      dataIndex: 'name',
      header: 'Product Name'
    }, {
      dataIndex: 'price',
      header: 'Price',
      display: function(value) {
        return '$ ' + (value / 100).toFixed(2);
      }
    }],
    renderTo: document.getElementById('ui-view')
  });

  grid.loadData(products);
})();
