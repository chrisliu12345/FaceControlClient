app.controller('DectCtrl', dectCtrl);

function dectCtrl($scope, $rootScope, $http, $modal, Query, $interval, QueryService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
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
                $scope.dtDataset=null;
            }else{
            $scope.dtDataset = $scope.result;
            }
        }, function (reason) {

        });
    } else {
        $http({
            url: '/ma/query/get',
            method: 'GET',
        }).then(function (result) {
            $scope.result = result.data.data;
            if ($scope.result === '0000') {
                alert("无查询结果");
                $scope.dtDataset=null;
            }
            else{
                $scope.dtDataset = $scope.result;
            }
            //$scope.dtDataset = $scope.result;
        }, function (reason) {

        });
       /* Query.get(function (data) {
            vm.querys = data.data;
            //根据任务代号修改为对应的名称

            $scope.dtDataset = vm.querys;
        });*/
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
                    $scope.dtDataset=null;
                }
                else{
                    $scope.dtDataset = $scope.result;
                }
            }, function (reason) {

            });
        }else{
            $http({
                url: '/ma/query/get',
                method: 'GET',
            }).then(function (result) {
                $scope.result = result.data.data;
                if ($scope.result === '0000') {
                    alert("无查询结果");
                    $scope.dtDataset=null;
                }
                else{
                    $scope.dtDataset = $scope.result;
                }
            }, function (reason) {

            });
       /* Query.get(function (data) {
            vm.querys = data.data;
            //根据任务代号修改为对应的名称
            $scope.dtDataset = vm.querys;
        });*/
        }
    };
    //定时刷新图像列表
    /*var timeconfig= $interval(function () {
        update_data()
    }, 30000, -1);*/
     //关闭页面销毁定时刷新功能
   /* $scope.$on('$destroy',function(){
        $interval.cancel(timeconfig);
    });*/
    vm.edit = function (index) {
        console.log("edit:" + index);
        var a = $scope.dtDataset[index];
        console.log(a);
        QueryService.set(a);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/query/edit.html',
            controller: 'FaceEditCtrl',
            controllerAs: 'editVm',
            backdrop: "static"
        });
        modalInstance.result.then(function () { //模态框关闭后返回函数，selectedItem为返回值
           // $state.go('app.query', {}, {reload: true});
        })
    };
    //点击人脸图片放大
    $scope.bigPeopic = function (x) {
        var viewer1 = new Viewer(document.getElementById(x),{
            url: 'data-original'
        });

    };
    $scope.bigAllpic = function (x) {
        var viewer2 = new Viewer(document.getElementById(x));
    };

//获取摄像机名称
    $http({
        url: '/ma/query/camera',
        method: 'GET'
    }).then(function (result) {
        $scope.cameras = result.data.data;
    }, function (reason) {

    });
//查询摄像机数据结果
    vm.queryCamera = function () {
        //停止定时刷新
       // $interval.cancel(timeconfig);
        $scope.cameraList = {};
        if ($rootScope.currentAccountUserinfo.decription === '3') {
            $scope.cameraList.policeNum = $rootScope.currentAccountUserinfo.policeNum;
        }
        var num = $scope.CameraName.split("-");
        $scope.cameraList.CameraId = num[0];
        $scope.cameraList.TaskType = num[1];
        if ($scope.Start1 === null || $scope.Start1 === '' || $scope.Start1 === undefined) {
            $scope.cameraList.Start = "2000-01-01 00:00:00.000";
        } else {
            $scope.cameraList.Start = $scope.Start1 + " " + "00:00:00.000";//开始时间
        }
        if ($scope.End1 === null || $scope.End1 === '' || $scope.End1 === undefined) {
            $scope.cameraList.End = getdatatime() + ".000";
        } else {
            $scope.cameraList.End = $scope.End1 + " " + "24:00:00.000";//结束时间
        }
        $http({
            url: '/ma/query/ResultCamera',
            method: 'POST',
            data: $scope.cameraList
        }).then(function (result) {
            $scope.result = result.data.data;
            if ($scope.result === '0000') {
                alert("无查询结果");
                $scope.dtDataset=null;
            }else{
            $scope.dtDataset = $scope.result;
            }
        }, function (reason) {

        });
    }
    //获取当前日期和时间
    var getdatatime = function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }


    /**
     * datatable参数设置
     */
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[2, 'desc']])
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
            .withTitle('识别图像')
            .notSortable()
            .withClass("text-center")
            .renderWith(function (data, type) {
               var index1 = $scope.dtDataset.indexOf(data);
               /* var ids = [];
                $scope.dtDataset.forEach(function (item) {
                    ids.push(item.id);
                })
                var index1 = ids.indexOf(data.id);*/
                var tt = data.id ;
                if (-1 !== index1) {
                    var PeopleFace = $scope.dtDataset[index1].url+ $scope.dtDataset[index1].DetectetFaceImage;
                    var AllPicture = $scope.dtDataset[index1].url + $scope.dtDataset[index1].CurrFrame;
                    return '<a href="javaScript:void(0)" ng-click="bigPeopic(' + tt + ')"> <img ng-src="' + PeopleFace + '" data-original="'+AllPicture+'" style="width:50px; height:50px;" id="' + tt + '"></a> ';
                }
            }),
        DTColumnBuilder.newColumn('inout')
            .withTitle('摄像机名称'),
        DTColumnBuilder.newColumn('datetmp')
            .withTitle('时间'),
        DTColumnBuilder.newColumn('orgadd')
            .withTitle('组'),
        DTColumnBuilder.newColumn('realName')
            .withTitle('姓名'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="修改"></i></a>'

            })
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
app.directive('ngTimeA', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function ($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            $('.form_date').datetimepicker({
                language: 'fr',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
        },
    };
});

