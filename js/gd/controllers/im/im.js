app.controller('ImController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.tabs = [true, false, false];
    $scope.tab = function (index) {
        angular.forEach($scope.tabs, function (i, v) {
            $scope.tabs[v] = false;
        });
        $scope.tabs[index] = true;
    }
}]);