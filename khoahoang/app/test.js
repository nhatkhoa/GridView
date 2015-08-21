(function() {


  var products = [{
    id: 'prod1',
    name: 'Product 1',
    desc: 'Product 1',
    price: 10000
  }, {
    id: 'prod2',
    name: 'Product 2',
    desc: 'Product 2',
    price: 20000
  }, {
    id: 'prod3',
    name: 'Product 3',
    desc: 'Product 3',
    price: 30000
  }, {
    id: 'prod4',
    name: 'Product 4',
    desc: 'Product 4',
    price: 40000
  }, {
    id: 'prod5',
    name: 'Product 5',
    desc: 'Product 5',
    price: 50000
  }];

  var parent = document.querySelector('[grid-repeat]');
  var expression = parent.attributes['grid-repeat'].nodeValue;
  console.log(expression);

  var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)?\s*$/);

  if (!match) {
    throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
      expression);
  }

  console.log(match);

  var innerHTML = parent.outerHTML;

  console.log(innerHTML);



  /*
  var cachedData = JSON.parse(localStorage.getItem('dataSource'));

      if (cachedData) {
        console.log(data);
        console.log(cachedData);
        this._dataSource = cachedData;
        for (var i = 0; i < this._dataSource.length; ++i) {
          this.addRow(this._dataSource[i]);
        }
        return;
      }

      if (data && data.length > 0) {
        this._dataSource = data;
        localStorage.setItem("dataSource", JSON.stringify(data));
        for (var i = 0; i < this._dataSource.length; ++i) {
          this.addRow(this._dataSource[i]);
        }
      }
    };
   */
})();
