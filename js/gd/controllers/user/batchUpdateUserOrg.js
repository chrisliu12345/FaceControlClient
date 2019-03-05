'use strict';
var orgUri = "/ma/org/";
app.factory("Org", function ($resource) {
    return $resource(orgUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT',
        }
    });
});
app.factory("OrgService", function () {
    var service = {};
    var org;
    service.get = function () {
        return org;
    }
    service.set = function (newOrg) {
        org = newOrg;
    }
    return service;
})
app.controller('batchUpdateUserOrgCtrl', batchUpdateUserOrgCtrl);

app.factory('OrgTree1', function ($resource) {
    return $resource('ma/orgtree/:id', {id:"@id"},{
        update:{
            method:'PUT'
        }
    })
});

app.factory('OrgTree', ['$http', '$q', function ($http, $q) {
    return {
        query: function (id) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            var url = '/ma/orgtree/' + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
            }).error(function (data, status, headers, config) {
                deferred.reject(data);   // 声明执行失败，即服务器返回错误
            });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        } // end query
    };
}]);

function batchUpdateUserOrgCtrl($scope,$rootScope, OrgTree, BroadcastEventDispatcher, $modalInstance, $location) {
    let vm = this;

    let tree;
    $scope.my_tree = tree = {};
    $scope.tree_data = [];

    let promise = OrgTree.query('1'); // 同步调用，获得承诺接口
    promise.then(function (data) {  // 调用承诺API获取数据 .resolve
        $scope.tree_data = data;
        console.log(data);
        console.log($scope.tree_data);
    }, function (data) {  // 处理错误 .reject
        console.log("error");
    });

    $scope.expanding_property = {
        field: "orgName",
        displayName: "组织机构",
        sortable: true,
        filterable: true
    };

    $scope.my_tree_handler = function (branch) {

        // 设置点击就是选中，并触发相应的函数
        tree.select_branch(branch);

        $scope.outputName = branch.orgName;
        $scope.outputId = branch.id;
        $scope.showConfirmButton = true;
    };

    $scope.try_adding_a_branch = function () {
        var b;
        b = tree.get_selected_branch();
        return tree.add_branch(b,{
            id:'test',
            orgName:'new branch'

        })
    };

    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };

    $scope.batchUpdateUserOrg = function () {
        BroadcastEventDispatcher.batchUpdateUserOrg($scope.outputId, $scope.outputName);
        $modalInstance.close();
    };
    $scope.cancelbatchUpdateUserOrg = function () {
        $modalInstance.close();
    }
}
