/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteAuthorityCtrl', function ($scope, $modalInstance, $state, AuthorityService, Authority) {

    $scope.currentAuthority = AuthorityService.get();

    var authorityId = $scope.currentAuthority.id;

    $scope.submit = function () {

        Authority.delete({}, {id: authorityId}, function () {

            $state.go('app.authority', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


