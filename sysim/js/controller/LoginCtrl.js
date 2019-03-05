imApp.controller('LoginCtrl', function($scope, user){
    // $scope.login_name = 'test2';
    // $scope.login_password = '111111';
    $scope.login = function(){
        $scope.currentUserName = $scope.login_name;
        user.login($scope.login_name, $scope.login_password);
    }
});