app.controller("navCtrl", function ($scope, $http) {

    $scope.query = function () {
        $http({
            url: '/ma/resource/menus',
            method: 'GET',
        }).then(function (result) {
            console.log(result.data);
            $scope.menus = result.data.data;
            console.log($scope.menus);
        }, function (reason) {
            console.log("获取导航列表失败");
        });
    };
    $scope.query();
});