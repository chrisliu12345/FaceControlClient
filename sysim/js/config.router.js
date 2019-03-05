/**
 * Created by Administrator on 2017/6/23.
 */

imApp.config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .otherwise('/app/im');
            $stateProvider
                .state('App', {
                    abstract: true,
                    url: '/app',
                    // template:'<div ui-view class="fade-in"></div>'
                    template: '<div ui-view ></div>'

                })
                .state('App.main', {
                    url: '/im',
                    templateUrl: 'sysim/view/main.html'
                })

                .state('App.login', {
                    url: '/login',
                    // template:'<h1>ok</h1>'
                    templateUrl: 'tpl/gd/auth/login.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/gd/auth/ctrl.js');
                            }]
                    }
                })

        }]);