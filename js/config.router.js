'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/auth/login');

                $stateProvider
                    .state('auth', {
                        abstract: true,
                        url: '/auth',
                        template: '<div ui-view class="fade-in"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/gd/auth/ctrl.js');
                                }]
                        }
                    })
                    .state('auth.loading', {
                        url: '/loading',
                        templateUrl: 'tpl/gd/auth/loading.html'
                    })
                    .state('auth.login', {
                        url: '/login',
                        templateUrl: 'tpl/gd/auth/login.html'
                    })
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/gd/blocks/app.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/gd/controllers/nav.js']);
                                }]
                        }
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/gd/dashboard.html',
                        ncyBreadcrumb: {
                            label: '<i class="fa fa-home"></i> 首页'
                        }
                    })


                    .state('app.user', {
                        url: '/user',
                        templateUrl: 'tpl/gd/user/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '人员管理'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/user/list.js',
                                                'js/gd/controllers/user/view.js',
                                                'js/gd/controllers/user/edit.js',
                                                'js/gd/controllers/user/add.js',
                                                'js/gd/controllers/user/addsPic.js',
                                                'js/gd/controllers/user/account.js',
                                                'js/gd/controllers/account/list.js',
                                                'js/gd/controllers/role/list.js',
                                                'js/gd/controllers/user/delete.js',
                                                'js/gd/controllers/user/batchUpdateUserOrg.js',
                                                'js/gd/controllers/user/edits.js',
                                                'js/gd/controllers/user/callBack.js',
                                                'js/gd/controllers/user/voiceBack.js',
                                                'js/gd/controllers/org/list.js',
                                                'js/gd/controllers/org/zTreeDirective.js',
                                                'js/gd/controllers/org/group/addGroup.js',
                                                'js/gd/controllers/org/group/deleteGroup.js',
                                                'js/gd/controllers/org/group/editGroup.js',
                                                'js/gd/controllers/org/people/add.js',
                                                'js/gd/controllers/org/people/edit.js',
                                                'js/gd/controllers/org/people/delete.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })




                    .state('app.role', {
                        url: '/role',
                        templateUrl: 'tpl/gd/role/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '角色列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/role/list.js',
                                                'js/gd/controllers/role/view.js',
                                                'js/gd/controllers/role/edit.js',
                                                'js/gd/controllers/role/delete.js',
                                                'js/gd/controllers/role/add.js']);
                                        }
                                    );
                                }]
                        }
                    })
                    /*.state('app.resource', {
                        url: '/resource',
                        templateUrl: 'tpl/gd/resource/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '菜单列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/resource/list.js',
                                                'js/gd/controllers/resource/view.js',
                                                'js/gd/controllers/resource/edit.js',
                                                'js/gd/controllers/resource/delete.js',
                                                'js/gd/controllers/resource/add.js']);
                                        }
                                    );
                                }]
                        }
                    })*/
                    .state('app.authority', {
                        url: '/authority',
                        templateUrl: 'tpl/gd/authority/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '权限列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/authority/list.js',
                                                'js/gd/controllers/authority/view.js',
                                                'js/gd/controllers/authority/edit.js',
                                                'js/gd/controllers/authority/delete.js',
                                                'js/gd/controllers/authority/add.js'
                                                ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.org', {
                        url: '/org',
                        templateUrl: 'tpl/gd/org/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '组织机构'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/org/list.js',
                                                'js/gd/controllers/org/zTreeDirective.js',
                                                'js/gd/controllers/org/group/addGroup.js',
                                                'js/gd/controllers/org/group/deleteGroup.js',
                                                'js/gd/controllers/org/group/editGroup.js',
                                                'js/gd/controllers/org/people/add.js',
                                                'js/gd/controllers/org/people/edit.js',
                                                'js/gd/controllers/org/people/delete.js',
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.config', {
                        url: '/config',
                        templateUrl: 'tpl/gd/config/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '配置管理'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['js/gd/controllers/config/list.js',
                                                'js/gd/controllers/config/attendance_data.js',
                                                'js/gd/controllers/config/attendance.js',
                                                'js/gd/controllers/config/camera.js',
                                                'js/gd/controllers/config/bigscreen.js',
                                                'js/gd/controllers/config/camerajs/edit.js',
                                                'js/gd/controllers/config/camerajs/delete.js',
                                                'js/gd/controllers/config/camerajs/add.js',
                                                'js/gd/controllers/config/camerajs/addtbl.js',
                                                'js/gd/controllers/config/view.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.face', {
                        url: '/face',
                        templateUrl: 'tpl/gd/face/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '人脸注册'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/face/list.js',
                                                'js/gd/controllers/face/delete.js',
                                               'js/gd/controllers/face/video.js',
                                                'js/gd/controllers/face/facedata.js',
                                                'js/gd/controllers/face/zTreeDirective.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.realtime', {
                        url: '/realtime',
                        templateUrl: 'tpl/gd/realtime/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '实时图像浏览'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/realtime/list.js',
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.query', {
                        url: '/query',
                        templateUrl: 'tpl/gd/query/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '查询与统计'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/gd/controllers/query/list.js',
                                                'js/gd/controllers/query/edit.js',
                                                'js/gd/controllers/query/attendanceStatistics.js',
                                                'js/gd/controllers/query/personalAttendance.js',
                                                'js/gd/controllers/query/queryAll.js',
                                                'js/gd/controllers/query/bigAllPic.js',
                                                'js/gd/controllers/query/bigPeoPic.js',
                                                'js/gd/controllers/query/detectImages.js'
                                            ]);
                                        }
                                    );
                                }]
                        }
                    })

                    .state('app.app.AppAccounts', {
                        url: '/AppAccounts',
                        // templateUrl: 'tpl/gd/account/list.html',
                        template: '<h1>hello </h1>',
                        controller: 'accountCtrl',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '查看账户信息'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load('js/gd/controllers/account/list.js');
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.account', {
                        url: '/account',
                        templateUrl: 'tpl/gd/account/list.html',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '账户列表'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(function () {
                                        return $ocLazyLoad.load(['js/gd/controllers/account/list.js',
                                            'js/gd/controllers/account/delete.js',
                                            'js/gd/controllers/account/view.js',
                                            'js/gd/controllers/account/edit.js',
                                            'js/gd/controllers/user/list.js']);
                                    })
                                }]
                        }
                    })
                    .state('layout', {
                        abstract: true,
                        url: '/layout',
                        templateUrl: 'tpl/gd/blocks/app.html'
                    })
                    .state('layout.im', {
                        url: '/im',
                        views: {
                            '': {
                                templateUrl: 'tpl/gd/im/im.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/gd/im/im_footer.html'
                            }
                        },
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '即时通讯'
                        },
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/tab.js', 'js/gd/controllers/im/im.js']);
                                }]
                        }
                    })
                    .state('app.editCurrentAccountUserinfo', {
                        url: '/editCurrentAccountUserinfo',
                        templateUrl: 'tpl/gd/user/edit.html',
                        controller: 'currentAccountUserinfoCtrl',
                        controllerAs: 'editVm',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '查看编辑当前用户信息'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load('js/gd/controllers/currentAccountUserinfoCtrl.js');
                                        }
                                    );
                                }]
                        }
                    })

                    .state('app.changePassword', {
                        url: '/changePassword',
                        templateUrl: 'tpl/gd/auth/changePassword.html',
                        controller: 'currentAccountUserinfoCtrl',
                        controllerAs: 'editVm',
                        ncyBreadcrumb: {
                            parent: 'app.dashboard',
                            label: '修改当前用户密码'
                        },
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/gd/controllers/currentAccountUserinfoCtrl.js');
                                }]
                        }
                    })
            }
        ]
    );

