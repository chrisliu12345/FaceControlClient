'use strict';

app.controller('ViewAccountCtrl', function ($scope, $modalInstance, AccountService) {

    $scope.account = AccountService.get();


    $scope.ok = function () {
        $modalInstance.close();
    };
});