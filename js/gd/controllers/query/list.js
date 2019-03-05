'use strict';
var queryUri = "/ma/query/";
app.factory("Query", function ($resource) {
    return $resource(queryUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("QueryService", function () {
    var service = {};
    var query;
    service.get = function () {
        return query;
    };
    service.set = function (newOrg) {
        query = newOrg;
    };
    return service;
});

app.controller('QueryCtrl', qrCtrl);

function qrCtrl($scope, $resource, $rootScope, $modal, Query, QueryService, $state, $http) {
    var vm = this;
    $scope.yincang=true;
    if($rootScope.currentAccountUserinfo.decription==='3'){
        $scope.yincang=false;
    }
    document.getElementById("checkPicture").style.fontSize="16px";
    vm.select_to_item=function (x) {
            $scope.name=x;
            $scope.ui=x;
        var cp = document.getElementById("checkPicture");
        var qa = document.getElementById("queryAll");
        var qc = document.getElementById("queryClass");
        var qp = document.getElementById("queryPerson");
        cp.style.fontSize="";
        cp.setAttribute("class", "");
        qa.style.fontSize="";
        qa.setAttribute("class", "");
        qc.style.fontSize="";
        qc.setAttribute("class", "");
        qp.style.fontSize="";
        qp.setAttribute("class", "");
        if (x === 1) {
            cp.style.fontSize="16px";
            cp.setAttribute("class", "label label-info");
        }
        if (x === 2) {
            qa.style.fontSize="16px";
            qa.setAttribute("class", "label label-info");
        }
        if (x === 3) {
            qc.style.fontSize="16px";
            qc.setAttribute("class", "label label-info");
        }
        if (x === 4) {
            qp.style.fontSize="16px";
            qp.setAttribute("class", "label label-info");
        }

    }
}

app.filter('highlight', function () {
    return function (text, search, caseSensitive) {
        if (search || angular.isNumber(search)) {
            text = text.toString();
            search = search.toString();
            if (caseSensitive) {
                return text.split(search).join('<span class="ui-match">' + search + '</span>');
            } else {
                return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
            }
        } else {
            return text;
        }
    };
});
