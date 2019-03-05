/**
 * Created by Administrator on 2018/4/16 0016.
 */
app.controller('callBackCtrl', function ($scope, $modalInstance, $state,$http, CsResultService) {

    $scope.currentUser = CsResultService.get();

    $scope.bigAllpic = function (x) {
        var viewer2 = new Viewer(document.getElementById(x));
    };

    $scope.cancel = function () {
        $http({
            url: '/ma/userAdd/deleteSession',
            method: 'GET'
        }).then(function (result) {
            $modalInstance.dismiss('cancel');
        }, function (reason) {
        });
        $state.go('app.user', {}, {reload: true});
    };
});