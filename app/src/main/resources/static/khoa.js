var Ajax = (function() {

    function Ajax(options) {
        this.options = options;
    }

    function get(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", url, true);
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                callback(JSON.parse(httpRequest.responseText));
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


    Ajax.prototype.getList = function(onSuccess) {
        get(this.url, onSuccess);
    };

    Ajax.prototype.update = function(data) {
    	get(this.url + data.id ,data , onSuccess);
    };

    Ajax.prototype.delete = function(id) {

    };

})();
