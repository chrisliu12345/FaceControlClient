/**
 * Created by Administrator on 2017/6/8.
 */

// 单个删除对应的controller
app.controller('DeleteUserCtrl', function ($scope, $http,$modalInstance, $state, UserService, User) {

    $scope.currentUser = UserService.get();

    var userId = $scope.currentUser.id;

    $scope.submit = function () {

        User.delete({}, {id: userId}, function (result) {
            //向CS端发送数据
            $http({
                url: '/ss/?DeleteIdDat=1&CollectId='+result.data,
                method: 'GET'
            }).then(function (result) {
                console.log("send cs ok");

            }, function (reason) {
               console.log("error");
            });
            //$scope.cancel();
           // $state.go('app.user', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

// 批量删除对应的controlller
app.controller('DeleteUsersCtrl', function ($scope,$rootScope, $http,$state, $modalInstance, BroadcastEventDispatcher ) {

    $scope.submit = function () {
        $http({
            method:"POST",
            url:"/ma/user/delete_select",

            data: $rootScope.uuUserid

        }).success(function(response){
            $http({
                url: '/ss/?DeleteIdDat=1&CollectId='+response.data,
                method: 'GET'
            }).then(function (result) {
                console.log("send cs ok");

            }, function (reason) {
                console.log("error");
            });
            $scope.cancel();
            $state.go('app.user', {}, {reload: true});
            $modalInstance.close();
        }).error(function(data){
            console.log("error"+data);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


