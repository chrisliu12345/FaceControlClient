app.controller("navCtrl", function ($scope, $http) {

    $scope.query = function () {
        var QUERY_URI = '/ma/resource/menus/';

        $http.get(QUERY_URI)
            .then(
                function (result) {
                    console.log(result.data.data);
                    $scope.menus = result.data.data;
                    console.log($scope.menus);
                },
                function () {
                    // alert("获取导航列表失败 nav.js query menus");
                    console.log("获取导航列表失败");
                }
            );
    };
    $scope.query();
});