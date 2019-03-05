/**
 * Created by Administrator on 2017/6/8.
 */

// 单个删除对应的controller
app.controller('DeleteSimCtrl', function ($scope, $http,$modalInstance, $state, FaceVideoService) {

    $scope.currentUser = FaceVideoService.get();
    $scope.submit = function () {
        $http({
            url: '/ma/video/deleteSimPic',
            method: 'POST',
            data:$scope.currentUser
        }).then(function (result) {
            $modalInstance.close();
        }, function (reason) {
            console.log(reason);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


