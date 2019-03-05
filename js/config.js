// config

var app =
    angular.module('app')
        .config(
            ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                    // lazy controller, directive and service
                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;
                    app.constant = $provide.constant;
                    app.value = $provide.value;
                }
            ])

        .config(['$translateProvider', function ($translateProvider) {


          /* $translateProvider.translations('cn',{
               test1:'雷神',
               test2:'华硕'
           }).translations('en',{
               test1:'西瓜',
               test2:'苹果'

           })

           */
            $translateProvider.useStaticFilesLoader({

                prefix:'/l10n/',
                suffix:'.json'
            });
            $translateProvider.preferredLanguage('cn');
            $translateProvider.useLocalStorage();
        }]);

app.config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        templateUrl: 'tpl/gd/blocks/breadcrumb.html'
    });
});

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);



