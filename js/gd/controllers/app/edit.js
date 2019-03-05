'use strict';

app.controller('EditAppCtrl', function ($scope, $resource, $http, $state, $modalInstance, App, AppService) {

    $scope.app = AppService.get();
    this.submit = function () {

        var appId = $scope.app.id;
        App.delete({}, {id: appId}, function () {
            console.log("update: " + $scope.app);
            $http.post(appUri, $scope.app)
                .success(function () {
                    $modalInstance.dismiss('cancel');
                    $state.go('app.encoder', {}, {reload: true});
                });
        });
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});