/**
 * Created by Administrator on 2017/6/8.
 */

// 单个删除对应的controller
app.controller('DeletePeoRightCtrl', function ($scope, $modalInstance, $state, OrgService, User) {

    $scope.currentUser = OrgService.get();

    var userId = $scope.currentUser.id;

    $scope.submit = function () {

        User.delete({}, {id: userId}, function () {
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


