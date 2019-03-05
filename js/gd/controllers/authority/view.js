'use strict'

app.controller('ViewAuthorityCtrl', function ($scope, $resource, $modalInstance, Authority, AuthorityService) {



    $scope.view = function () {

        $scope.authority = AuthorityService.get();
    }
    $scope.view();
    this.submit = function () {
        // console.log($scope.resource.resourceName);
        // console.log($scope.resource.description);


        $modalInstance.close();
    };

    this.ok = function () {
        $modalInstance.close();
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});