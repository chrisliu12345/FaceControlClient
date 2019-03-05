'use strict'

app.controller('EditRoleCtrl', function ($scope, $resource,$http,$state, $modalInstance, Role, RoleService) {



    $scope.edit = function () {

        $scope.role = RoleService.get();
    }
    $scope.edit();


    this.submit = function () {
        // console.log($scope.user.realName);
        // console.log($scope.user.org);


        var roleId = $scope.role.id;
        $http({
            method:"POST",
            url:"/ma/role/updateRole",
            data:$scope.role
        }).success(function(){
            $modalInstance.dismiss('cancel');
            $state.go('app.role',{},{reload:true});
        }).error(function(){

        });




        /*Role.delete({},{id: roleId}, function () {
            console.log("update: "+$scope.role);
            $http.post(roleUri,$scope.role)
                .success(function(){
                    $modalInstance.dismiss('cancel');
                    $state.go('app.role',{},{reload:true});
                });
        });*/
    };

    this.ok = function () {
        $modalInstance.close();
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});