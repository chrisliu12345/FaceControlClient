'use strict';

app.controller('ViewResourceCtrl', function ($scope, $resource, $modalInstance, Resource, ResourceService) {


    $scope.resource = ResourceService.get();

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});