'use strict'

app.controller('AddRoleCtrl', function ($scope,$rootScope, $http, $resource, $modalInstance, $state, Role) {
    $scope.role = {};
    $scope.role.authorities = [];
    this.submit = function () {

        // console.log($scope.user.realName);
        //console.log($scope.org.selected.id);
        // $scope.role.authority = $scope.authority.selected.name;
      // alert($scope.role.authorities);
        var auArray = new Array();
        auArray = $scope.role.authorities;
        console.log(auArray);

        Role.save({}, $scope.role, function () {

            $modalInstance.dismiss('cancel');
            $state.go('app.role', {}, {reload: true});
        });

    };
    $http.get('/ma/authority/')
        .success(function (data) {
            console.log(data.data);
            $scope.authorities = data.data;


        });
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});