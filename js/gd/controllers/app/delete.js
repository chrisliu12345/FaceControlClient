/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteAppCtrl', function ($scope, $modalInstance, $state, AppService, App) {

    $scope.currentApp = AppService.get();

    var appId = $scope.currentApp.id;

    $scope.submit = function () {

        App.delete({}, {id: appId}, function () {
            $state.go('app.encoder', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


