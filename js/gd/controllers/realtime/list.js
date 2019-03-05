
'use strict';
var queryRealUri = "/ma/query/";
app.factory("QueryReal", function ($resource) {
    return $resource(queryRealUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("QueryRealService", function () {
    var service = {};
    var queryReal;
    service.get = function () {
        return queryReal;
    };
    service.set = function (newOrg) {
        queryReal = newOrg;
    };
    return service;
});

app.controller('DectRealCtrl', dectCtrl);

function dectCtrl($scope, $rootScope, $http, $modal, QueryReal, $interval, QueryRealService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.cameras = [];
    $scope.dtDataset = [];


    /**
     * datatable相关变量
     */
        //datatable的api实例变量
    var myTable;
    $scope.myTable = false;
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;

    //datatable当前页数据（用户）的临时数
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];

    /* datatable相关变量 */
    //当前用户为普通用户
    if ($rootScope.currentAccountUserinfo.decription === '3') {
        $http({
            url: '/ma/query/get1',
            method: 'POST',
            data: $rootScope.currentAccountUserinfo.policeNum
        }).then(function (result) {
            $scope.result = result.data.data;
            if ($scope.result === '0000') {
                alert("无查询结果");
            }
            $scope.dtDataset = $scope.result;
        }, function (reason) {

        });
    } else {

        QueryReal.get(function (data) {
            vm.querys = data.data;
            //根据任务代号修改为对应的名称

            $scope.dtDataset = vm.querys;
        });
    }

    var update_data = function () {
        if ($rootScope.currentAccountUserinfo.decription === '3') {
            $http({
                url: '/ma/query/get1',
                method: 'POST',
                data: $rootScope.currentAccountUserinfo.policeNum
            }).then(function (result) {
                $scope.result = result.data.data;
                if ($scope.result === '0000') {
                    alert("无查询结果");
                }
                $scope.dtDataset = $scope.result;
            }, function (reason) {

            });
        }else{
        QueryReal.get(function (data) {
            vm.querys = data.data;
            //根据任务代号修改为对应的名称
            $scope.dtDataset = vm.querys;
        });
        }
    };
    //定时刷新图像列表
    var timeConfig= $interval(function () {
        update_data()
    }, 6000, -1);
     //关闭页面销毁定时刷新功能
    $scope.$on('$destroy',function(){
        $interval.cancel(timeConfig);
    });

    //点击人脸图片放大
    $scope.bigPeopic = function (x) {
        var viewer1 = new Viewer(document.getElementById(x));

    };
    $scope.bigAllpic = function (x) {
        var viewer2 = new Viewer(document.getElementById(x));
    };

    /**
     * datatable参数设置
     */
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[1, 'desc']])
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                console.log("header call back");
                $scope.headerCompiled = true;
                $compile(header)($scope);
            }
        })
        .withOption('fnDrawCallback', function (oSettings) {
            currentPageUser = tempCurrentPageUser;
            tempCurrentPageUser = [];
            if ($scope.manual$applyTag) {
                /*$scope.$apply();*/
            }
        })
        .withOption('initComplete', function (settings, json) {
            $scope.manual$applyTag = true;
            $scope.myTable = true;
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(row)($scope);
        })
        .withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            tempCurrentPageUser.push(aData);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null)
            .withTitle('人脸图像')
            .notSortable()
            .withClass("text-center")
            .renderWith(function (data, type) {
                // var index1 = $scope.dtDataset.indexOf(data);
                var ids = [];
                $scope.dtDataset.forEach(function (item) {
                    ids.push(item.id);
                })
                var index1 = ids.indexOf(data.id);
                var tt = data.id + "1";
                if (-1 !== index1) {
                    var PeopleFace = $scope.dtDataset[index1].url + $scope.dtDataset[index1].DetectetFaceImage;
                    return '<a href="javaScript:void(0)" ng-click="bigPeopic(' + tt + ')"> <img ng-src="' + PeopleFace + '" style="width:50px; height:50px;" id="' + tt + '"></a> ';
                }


                //获取图片参数
                /* return '<img src="'+df+'">';*/
            }),
        DTColumnBuilder.newColumn(null)
            .withTitle('完整图像')
            .notSortable()
            .withClass("text-center")
            .renderWith(function (data, type) {
                var ids2 = [];
                $scope.dtDataset.forEach(function (item) {
                    ids2.push(item.id);
                })
                var index2 = ids2.indexOf(data.id);

                if (-1 !== index2) {

                    var AllPicture = $scope.dtDataset[index2].url + $scope.dtDataset[index2].CurrFrame;
                    return '<a href="javaScript:void(0)" ng-click="bigAllpic(' + data.id + ')"> <img ng-src="' + AllPicture + '" style="width:50px; height:50px;"id="' + data.id + '" ></a>';
                }
            }),
        DTColumnBuilder.newColumn('inout')
            .withTitle('摄像机名称'),
        DTColumnBuilder.newColumn('datetmp')
            .withTitle('时间'),
        DTColumnBuilder.newColumn('orgadd')
            .withTitle('组'),
        DTColumnBuilder.newColumn('realName')
            .withTitle('姓名')
    ];

}
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


