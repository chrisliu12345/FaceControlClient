angular.module('app')
    .run(
        function ($rootScope, $state, $stateParams, $localStorage, $http) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
               $rootScope.token=$utoken;
        }
    );