'use strict'

app.controller('AddResourceCtrl', function ($scope, $http, $resource, $modalInstance, $state, Resource, ResourceService) {
    $scope.resource = {};

    // $scope.resource.authorities = [];
    this.submit = function () {


        console.log($scope.resource.authorities);
        var auArray = new Array();
        auArray = $scope.resource.authorities;
        console.log(auArray);

        Resource.save({}, $scope.resource, function () {
            $modalInstance.dismiss('cancel');
            $state.go('app.resource', {}, {reload: true});
        });

    };
    Resource.get(function (data) {
        $scope.resources = data.data;
    });
    $scope.types = [{
        "name": "按钮",
        "code": "BUTTON"
    }, {
        "name": "接口",
        "code": "API"
    }, {
        "name": "菜单",
        "code": "MENU"
    }];
    // this.authorities = [{
    //     "id": "111",
    //     "name": "权限1",
    // }, {
    //     "id": "222",
    //     "name": "权限2",
    // }];

    $http.get('/ma/authority/')
        .success(function (data) {
            console.log(data.data);
            $scope.authorities = data.data;
        });
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});