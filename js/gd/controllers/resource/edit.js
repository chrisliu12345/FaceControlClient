'use strict'

app.controller('EditResourceCtrl', function ($scope, $resource,$http,$state, $modalInstance, Resource, ResourceService) {



    $scope.edit = function () {

        $scope.resource = ResourceService.get();
    }
    $scope.edit();
    this.submit = function () {
        // console.log($scope.user.realName);
        // console.log($scope.user.org);


        var resourceId = $scope.resource.id;
        Resource.delete({},{id: resourceId}, function () {
            console.log("update: "+$scope.resource);
            $http.post(resourceUri,$scope.resource)
                .success(function(){
                    $modalInstance.dismiss('cancel');
                    $state.go('app.resource',{},{reload:true});
                });
        });
    };

    this.ok = function () {
        $modalInstance.close();
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});