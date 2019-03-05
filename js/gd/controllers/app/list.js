'use strict';

var appUri = "/ma/encodec/";
app.factory("App1", function ($resource) {
    return $resource(appUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("App1Service", function () {
    var service = {};
    var app;
    service.get = function () {
        return app;
    };
    service.set = function (newApp) {
        app = newApp;
    };
    return service;
});


app.controller('App1Ctrl', appCtrl);

function appCtrl($scope, $rootScope, $resource, $state, $http, $modal, App, AppService, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;

    App.get(function (data) {
        vm.apps = data.data;
        console.log(vm.apps);
        //getDatatableAPI(vm.apps);
        $scope.dtDataset = vm.apps;
    });

    vm.remove = function (index) {

        console.log(vm.apps[index].id);
        AppService.set(vm.apps[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/delete.html',
            controller: 'DeleteAppCtrl',
            size: 'sm'
        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/add.html',
            controller: 'AddAppCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
    };
    vm.view = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.apps[index].createTime);
        var app = vm.apps[index];
        console.log(app);
        AppService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/view.html',
            controller: 'ViewAppCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };

    // 查看某个APP对应的账户
    vm.account = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.apps[index].createTime);
        var app = vm.apps[index];
        console.log(app);
        AppService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/account.html',
            controller: 'AppAccountCtrl',
            backdrop: "static",
            size: 'lg'

        });
    };
    vm.edit = function (index) {
        console.log("edit:" + index);
        var app = vm.apps[index];
        console.log(app);
        AppService.set(app);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/edit.html',
            controller: 'EditAppCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

        });
    };


    vm.export = function () {
        $http({
            method: "GET",
            url: "ma/encoder/codec_export",
            headers: {
                Authorization: $rootScope.tokens
            },
            responseType: 'arraybuffer'

        }).then(function successCallback(data) {
                var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});
                var objectUrl = URL.createObjectURL(blob);
                var aForExcel = $("<a><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                $("body").append(aForExcel);
                $(".forExcel").click();
                aForExcel.remove();
            }
            , function errorCallback() {
                alert("ERROR");
            });

    }

    vm.addApps = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/adds.html',
            controller: 'AddAppsCtrl',
            controllerAs: 'addsVm',
            backdrop: "static"

        });
    };
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };


    /**
     * datatable参数设置
     */
    $scope.dtDataset = [];
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    $scope.headerCompiled = false;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(row)($scope);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('选择').notSortable().renderWith(function (data, type, full, meta) {
            var index = $scope.dtDataset.indexOf(data);
            $scope.numb=index;
            var ss = data.id;
            /*         return '<input type="checkbox"  ng-model="a[' + ss + ']" ng-checked="false"   ng-click="all(' + data.id + ',a[' + ss + '])" id="' + data.id + '" name="change_one" >';//checked="checked"*/
            return '<input type="checkbox"  ng-model="a[' + ss + ']" ng-checked="selectAll"   ng-click="all(' + data.id + ',a[' + ss + '])" id="' + data.id + '" name="change_one" >';
        }),
        DTColumnBuilder.newColumn('encoder_name')
            .withTitle('名称'),
        DTColumnBuilder.newColumn('groups')
            .withTitle('组域'),
        DTColumnBuilder.newColumn('encoder_address')
            .withTitle('地址'),
        DTColumnBuilder.newColumn('encoder_port')
            .withTitle('端口'),
        DTColumnBuilder.newColumn('encoder_channel')
            .withTitle('编码器类型'),
        DTColumnBuilder.newColumn('encoder_stream_number')
            .withTitle('编码通道数'),
        DTColumnBuilder.newColumn('decod_channel')
            .withTitle('解码通道数'),
        DTColumnBuilder.newColumn('lit_channel_number')
            .withTitle('通明通道数'),
        DTColumnBuilder.newColumn('loginname')
            .withTitle('登录名'),
        DTColumnBuilder.newColumn('password')
            .withTitle('密码'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {

                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看编码器"></i></a>' +
                    '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑编码器"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除编码器"></i></a>';
                // '<a type="button"  ui-sref=".AppAccounts"  class="btn btn-success btn-xs"> <i class="fa fa-area-chart" tooltip="查看账户"></i></a>';
            })
    ];


    $rootScope.array = new Array();
    $scope.all = function (a, m) {

        if (m == true)
            $rootScope.array.push(a);
        if (m == false)
            for (var i = 0; i < $rootScope.array.length; i++) {
                if (a == $rootScope.array[i]) {
                    $rootScope.array.splice(i, 1);
                }
            }
        return $rootScope.array;
    };

    $scope.show_all = function (s) {
        if (s == true) {
            $scope.myWar = true;
        }
        if (s == false) {
            $scope.myWar = false;
        }

    }

    $scope.delColumn = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/delete_change.html',
            controller: 'Delete_changeCtrl',
            size: 'sm'
        });

    };

    $scope.delAll = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/app/delete_ALL.html',
            controller: 'Delete_changeCtrl',
            size: 'sm'
        });
    };
    /* $scope.select_all=function(as){
     // alert(as);
     if(as==true){
     document.getElementsByName("change_one").checked=true;
     }
     }*/

    $http({
        method: 'GET',
        url: '/ma/encoder/select_code',
        Authorization: $rootScope.token

    }).then(function successCallback(response) {
        $scope.arraylist = new Array();
        $scope.typecode = new Array();

        for (var i = 0; i < response.data.data.length; i++) {
            $scope.arraylist.push(response.data.data[i].names);
            $scope.typecode.push(response.data.data[i].codetype);
        }
        $rootScope.names = $scope.arraylist;
        $rootScope.codetype = $scope.typecode;
        // alert(response.data.data[0].names);
    }, function errorCallback(response) {

    });


    app.filter('highlight', function () {
        return function (text, search, caseSensitive) {
            if (search || angular.isNumber(search)) {
                text = text.toString();
                search = search.toString();
                if (caseSensitive) {
                    return text.split(search).join('<span class="ui-match">' + search + '</span>');
                } else {
                    return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
                }
            } else {
                return text;
            }
        };
    });
}