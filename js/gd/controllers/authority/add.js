'use strict'
var ss;
app.controller('AddAuthorityCtrl', function ($scope,$rootScope, $modal, $http, $resource, $modalInstance, $state, Authority) {

    this.submit = function () {

        $scope.authority.selected = $scope.selected;

        console.log($scope.authority);

        Authority.save({}, $scope.authority, function () {
            $modalInstance.dismiss('cancel');
            $state.go('app.authority', {}, {reload: true});

        });

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $http({
        url: "/ma/authority/queryAll",
        method: "GET",


    }).success(function (data) {
        console.log(data.data);
        $scope.menus = data.data;
    }).error(function () {

    });

    $scope.selected = [];
    $scope.selectedNames = [];

    var updatedSelected = function (action, id, name) {
        if (action == 'add' && $scope.selected.indexOf(id) == -1) {
            $scope.selected.push(id);
            $scope.selectedNames.push(name);
        }
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
            var id = $scope.selected.indexOf(id);
            $scope.selected.splice(id, 1);
            $scope.selectedNames.splice(id, 1);
        }

    }
    $scope.updateedSelect = function ($event, id) {

        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updatedSelected(action, id, checkbox.name);
    };



})

