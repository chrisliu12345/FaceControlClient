app.controller('LoadingController', function ($scope, $resource, $state) {
    // var $com = $resource($scope.app.host + "/account/all");
    // $com.get(function () {
    //     $state.go('app.user');
    // }, function () {
    //     $state.go('auth.login');
    // })
});
app.controller('LoginController', function ($rootScope, $scope, $state, $http, $cookieStore,$translate) {
    //var REST_SERVICE_URI = 'http://localhost:8080/SecureRESTApiWithBasicAuthentication/user/';
    // $scope.host='192.168.5.183:9090';$scope.host +
    var REST_SERVICE_URI = '/ma/login/';
    // $scope.user.={};
    $scope.changelanguage=function (y) {

        $translate.use(y);

    };
    $rootScope.loginDirect=$scope.login = function () {
        $scope.authError = "";
        $rootScope.username = $scope.user.username;
        $rootScope.password = $scope.user.password;

        $cookieStore.put('username', $rootScope.username);
        $cookieStore.put('password', $rootScope.password);


        var stata2 = {
            username: $rootScope.username,
            password: $rootScope.password
        };

// 修改为token认证，先要用户名和密码获取token
        $http({
            method: 'POST',
            url: '/ma/auth',
            data: stata2
        }).then(function successCallback(data) {
            $scope.tokens = 'Bearer' + ' ' + data.data.token;

            $rootScope.token = $scope.tokens;
            $cookieStore.put('token',$scope.tokens );

            $http({
                method: 'GET',
                url: '/ma/login'
            }).then(function (response) {
                $rootScope.currentAccountUserinfo = {};
                var group=response.data.data[0].userinfo[0].parentorg+"|"+response.data.data[0].userinfo[0].org;
                var account = {
                    accountName: $rootScope.username,
                    password: $rootScope.password,
                    realName: response.data.data[0].userinfo[0].realName,
                    avatar: response.data.data[0].userinfo[0].picture,
                    tokens:$scope.tokens,
                    decription:response.data.data[0].decripton,
                    bumen:group,
                    policeNum:response.data.data[0].userinfo[0].policeNum
                };
                $cookieStore.put('account', account);
                angular.copy(account, $rootScope.currentAccountUserinfo);
                $rootScope.accountId = response.data.accountId;
                $state.go('app.dashboard');
            }, function (reason) {
                console.log(reason);
                $scope.authError = "服务器登录错误";
            })
        });
    }



});





