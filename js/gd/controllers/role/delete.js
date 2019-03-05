/**
 * Created by Administrator on 2017/6/8.
 */
app.controller('DeleteRoleCtrl', function ($scope, $modalInstance, $state, RoleService, Role) {

    $scope.currentRole = RoleService.get();

    var roleId = $scope.currentRole.id;

    $scope.submit = function () {

        Role.delete({}, {id: roleId }, function () {
            $state.go('app.role', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


