'use strict';

app.controller('AppAccountCtrl', function ($scope, $http, Account, AppService, $state,
                                           $compile, App, User, DTOptionsBuilder, DTColumnBuilder, $modalInstance) {

    // 获取从list传来的app id 号
    $scope.currentApp = AppService.get();


    var vm = this;
    vm.accounts = [];
    var myMap = new Map();

    vm.successGetUserNum = 0;
    vm.failGetUserNum = 0;

    // 获取App列表，默认选中第一个APP
    App.get(function (response) {

        // 这个是为了关联appid 和app name
        $scope.AppIds = response.data;

        $scope.AppIds.forEach(function (value, index) {
            myMap.set($scope.AppIds[index].id, value.name);
        });

        // // 获取账户(所有账户)列表, 并调用dataTable进行显示
        // Account.get(function (response) {
        //
        //     // 获取到账户数据
        //     vm.accounts = response.data;
        //     $scope.allAppsAccounts = vm.accounts;
        //
        //     createDatatableData();
        //
        // }, function (response) {
        //     console.log(" get Accounts list error: " + response);
        // });

        // 获取数据
        $http({
            url: "/ma/account/queryAccount",
            method: "POST",
            data: {"appId": $scope.currentApp.id}
            // data: {"appId": "9335241e-8890-4ae7-b11c-66013934767d"}
        }).then(function successCallback(response) {
            console.log(response);
            vm.accounts = response.data.data;
            createDatatableData();
        });

    }, function (response) {
        console.log('get app ids failed !')
    });

    var createDatatableData = function () {

        vm.successGetUserNum = 0;
        vm.failGetUserNum = 0;

        for (var i = 0; i < vm.accounts.length; i++) {
            vm.accounts[i].appName = myMap.get(vm.accounts[i].appId);
        }

        vm.accounts.forEach(function (value, index) {

            $http({
                url: '/ma/accountUser/' + value.id + '/user',
                method: 'GET'
            }).then(function (response) {
                $scope.user = response.data.data;
                vm.accounts[index].realName = $scope.user.realName;
                //$scope.datatableDataset = vm.accounts;
                //getDatatableAPI($scope.datatableDataset);
                vm.successGetUserNum++;
                if ((vm.successGetUserNum + vm.failGetUserNum) === vm.accounts.length) {
                    //getDatatableAPI(vm.accounts);
                    $scope.dtDataset = vm.accounts;
                }

            }, function (response) {
                vm.failGetUserNum++;
                console.log("get User info error!");
            });
        });

        if (vm.accounts.length === 0) {
            //getDatatableAPI(vm.accounts);
            $scope.dtDataset = vm.accounts;
        }

    };

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
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
        DTColumnBuilder.newColumn('username')
            .withTitle('账号'),
        DTColumnBuilder.newColumn('realName')
            .withTitle('用户名'),
        DTColumnBuilder.newColumn('appName')
            .withTitle('所属App')
        // DTColumnBuilder.newColumn(null)
        //     .withTitle('操作')
        //     .notSortable()
        //     .renderWith(function (data, type, full, meta) {
        //         var index = $scope.dtDataset.indexOf(data);
        //         return '<a type="button" ng-click="showCase.viewAccount(' + index + ')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看账号"></i></a>' +
        //             '<a type="button" ng-click="showCase.editAccount(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑账号"></i></a>' +
        //             '<a type="button" ng-click="showCase.removeAccount(' + index + ')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除账号"></i></a>';
        //     })
    ];
});
