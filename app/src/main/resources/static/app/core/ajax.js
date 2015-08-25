var Ajax = (function() {
  'use strict';

  function Ajax(options) {
    this.options = options;
  }

  function get(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var dataResponse = JSON.parse(httpRequest.responseText);
        callback(dataResponse);
      }
    };
    httpRequest.send();
  }

  function post(url, jsondata, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        callback(httpRequest.responseText);
      }
    }
    httpRequest.send(JSON.stringify(jsondata));
  }

  Ajax.prototype.getEmployees = function(onSuccess) {

    get(this.options.getEmployeesUrl, onSuccess);
  };

  Ajax.prototype.getDepartments = function(onSuccess) {

    get(this.options.getDepartmentsUrl, onSuccess);
  };


  Ajax.prototype.update = function(data, onSuccess) {
    post(this.options.url + data.id, data, onSuccess);
  };

  Ajax.prototype.delete = function(id) {

  };

  return Ajax;

})();
