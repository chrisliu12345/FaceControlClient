angular.module('app')
    .factory('AuthInterceptor', ['$rootScope', '$q', '$location','$cookieStore',
        function ($rootScope, $q, $location, $cookieStore ) {

        return {
            'request': function (config) {
                config.headers = config.headers || {};
                var username = $cookieStore.get('username');
                var password = $cookieStore.get('password');
                if(undefined === username && undefined === password)
                {
                    return config;
                }

                var encodedString = btoa(username + ":" + password);
                config.headers.Authorization = $cookieStore.get('token');
                // var k=[];
                $rootScope.currentAccountUserinfo = {};
                var account = $cookieStore.get('account');
                // angular.copy(account, k);
                angular.copy(account, $rootScope.currentAccountUserinfo);
                $rootScope.token=$rootScope.currentAccountUserinfo.tokens;
                return config;
            },
            'responseError': function (response) {

                if (response.status === 401) {
                     alert("用户名密码错误，请重新输入！");
                    // $state.go('auth.login', {}, {reload: true});
                    console.log("请重新登录");
                    // window.href = '#/auth/login';
                    // window.location = "http://192.168.5.183:9091";
                    $location.url('/auth/login');
                }
                return $q.reject(response);
            }
        }

    }]);

