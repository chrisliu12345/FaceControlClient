/**
 * Created by 郄梦岩 on 2017/8/6.
 */
app.controller('Delete_changeCtrl', function ($scope, $modalInstance, $rootScope,$state,$http) {

    $scope.delete_change=function(){
        $http({
            method: 'POST',
            url: '/ma/encoder/delete_change',
            data:$rootScope.array
        }).then(function successCallback() {

            $state.go('app.encoder', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    };


    $scope.delete_All=function(){
        $http({
            method: 'GET',
            url: '/ma/encoder/delete_all',
        }).then(function successCallback() {

            $state.go('app.encoder', {}, {reload: true});
            $modalInstance.close();
        },function errorCallback(response) {
            alert("error");
        });
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});