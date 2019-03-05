'use strict';

app.controller('ViewAppCtrl', function ($scope, $resource, $modalInstance, App, AppService) {


    $scope.app = AppService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});