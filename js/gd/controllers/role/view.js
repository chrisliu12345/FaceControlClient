'use strict'

app.controller('ViewRoleCtrl', function ($scope, $resource, $modalInstance, Role, RoleService) {



    $scope.view = function () {

        $scope.role = RoleService.get();
    }
    $scope.view();

   this.ok = function () {
        $modalInstance.close();
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});