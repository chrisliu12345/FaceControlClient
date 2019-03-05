'use strict';

app.controller('ViewUserCtrl', function ($scope, $resource, $modalInstance, User, UserService, $http, DTOptionsBuilder, DTColumnBuilder) {
    $scope.user = {
        "realName": "",
        "org": ""
    };

    var appMap = new Map();
//获取当前考勤地点

    $scope.view = function () {
        $scope.user = UserService.get();
        $http({
            url: '/ma/orgtree/locationNow',
            method: 'POST',
            data:$scope.user.autoGraph
        }).then(function (result) {
            $scope.locationNow = result.data.data;
            /*alert(result.data.data[0].orgName);*/
        }, function (reason) {

        });
        $http.get('ma/app')
            .success(function (data) {
                for(var i = 0; i < data.data.length; i++){
                    appMap.set(data.data[i].id, data.data[i]);
                }
                $http.get('/ma/accountUser/'+ $scope.user.id +'/accounts')
                    .success(function (data) {
                        var accountAppArray = [];
                        for(var i = 0; i < data.data.length; i++){
                            if(data.data[i] !== null){
                                var appObject = appMap.get(data.data[i].appId);
                                if(appObject !== undefined){
                                    var accountApp = {};
                                    accountApp.username = data.data[i].username;
                                    accountApp.appName = appObject.name;
                                    accountApp.appDescription = appObject.description;
                                    accountAppArray.push(accountApp);
                                }
                            }
                        }
                        //$scope.accountAppArray = accountAppArray;
                        //getDatatableAPI($scope.accountAppArray);
                        $scope.dtDataset = accountAppArray;
                    });
            });
    };

    /**
     * datatable参数设置
     */
    $scope.dtDataset = [];
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    $scope.headerCompiled = false;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withNotAutoWidth()
        .withNotFilter()
        .withNotPaging()
        .withNotSort()
        .withNotLengthChange();
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('username')
            .withTitle('账号'),
        DTColumnBuilder.newColumn('appName')
            .withTitle('所属App'),
        DTColumnBuilder.newColumn('appDescription')
            .withTitle('App详情')
    ];
    // var getDatatableAPI = function(data){
    //     $('#userAppAccountList').DataTable( {
    //         paging: false,
    //         data: data,
    //         bSort:false,
    //         bFilter: false,
    //         bAutoWidth: false,
    //         bLengthChange:false,
    //         columns: [
    //             {
    //                 data: 'username', defaultContent: "缺少此项信息"
    //             },
    //             {
    //                 data: 'appName', defaultContent: "缺少此项信息"
    //             },
    //             {
    //                 data: 'appDescription', defaultContent: "缺少此项信息"
    //             }
    //         ]
    //     } );
    // };
    $scope.view();
    this.submit = function () {
        console.log($scope.user.realName);
        console.log($scope.user.org);

        User.save({}, {realName: "张三", org: "研发"});
        $modalInstance.close(this.selected.item);
    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});