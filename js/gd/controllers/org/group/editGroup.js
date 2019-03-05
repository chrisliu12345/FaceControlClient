'use strict';

app.controller('EditGroRightCtrl', function ($scope, $resource, $http, $state, $modalInstance,OrgService) {

    $scope.gro = OrgService.get();
    this.submit = function () {
        $http({
            url:"/ma/org",
            method:"PUT",
            data:$scope.gro
        }).then(function success(response){
            //$state.go('app.groups', {}, {reload: true});

            $modalInstance.close();
        },function error(){
            console.log("error");
        });
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});