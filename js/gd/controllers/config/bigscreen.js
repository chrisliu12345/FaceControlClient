/**
 * Created by Administrator on 2017/12/19 0019.
 */
app.controller('BigCtrl', bigCtrl);

function bigCtrl($scope, $resource, $rootScope, $modal, Config, ConfigService, $state, $http) {
    //读取历史大屏数据
    $http({
        url: '/ma/config/getText',
        method: 'GET'
    }).then(function (result) {
        $scope.items = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    //读取cs端展示面板数据
    $scope.CsText = {};
    $http({
        url: '/ma/config/getCSText',
        method: 'GET'
    }).then(function (result) {
        $scope.lis = result.data.data;
        for (var i = 0; i < $scope.lis.length; i++) {

        }

    }, function (reason) {

    });
    //添加大屏文字
    this.submit1 = function () {
        $http({
            url: '/ma/config/addText',
            method: 'POST',
            data: $scope.addText
        }).then(function (result) {
            alert("添加成功");
            //异步同步数据方法Synchronous Data
            Synchronous_Data();
        }, function (reason) {

        });
    }
    //设置大屏文字
    this.submit2 = function () {
        $http({
            url: '/ma/config/addConfigText',
            method: 'POST',
            data: $scope.configText
        }).then(function (result) {
            $http({
                url: '/ma/config/getTextNow',
                method: 'GET'
            }).then(function (result) {
                $scope.disPlay = result.data.data;
                $scope.configText=$scope.disPlay.ContentId;
                /*alert(result.data.data[0].orgName);*/
            }, function (reason) {

            });
            $http({
                url: '/ss/?UpdateTitleText=1&ContentID=' + $scope.configText,
                method: 'GET',
            }).then(function (result) {
            }, function (reason) {
                console.log(reason);
                alert("error" + reason);
            });
            //异步同步数据方法Synchronous Data
        }, function (reason) {

        });
    }
    //设置CS端展示面板
    this.submit3 = function () {
        $http({
            url: '/ma/config/addCSText',
            method: 'POST',
            data: $scope.CsText
        }).then(function (result) {
            $http({
                url: '/ma/config/getCSTextNow',
                method: 'GET'
            }).then(function (result) {
                $scope.csConfig = result.data.data;
                $scope.CsText=$scope.csConfig.PanelId;
                /*alert(result.data.data[0].orgName);*/
            }, function (reason) {

            });
          $http({
                url: '/ss/?' + $scope.CsText,
                method: 'GET'
            }).then(function (result) {
                alert("设置成功！")
            }, function (reason) {
                console.log(reason);
            });
            //异步同步数据方法Synchronous Data
        }, function (reason) {

        });
    }
    //给config表设置摄像机ID
    this.submit4 = function () {
        $http({
            url: '/ma/config/addCamera1',
            method: 'POST',
            data: $scope.camera1
        }).then(function (result) {
            $http({
                url: '/ma/config/getCameraNow',
                method: 'GET'
            }).then(function (result) {
                $scope.camera = result.data.data;
                $http({
                    url: '/ss/?UpdateShowVideo=1&CameraID=' + $scope.camera1,
                    method: 'GET'
                }).then(function (result) {
                    alert("设置成功");
                    /!*alert(result.data.data[0].orgName);*!/
                }, function (reason) {

                });
                if($scope.camera.TaskType==='0') {
                    $scope.CameraNow = $scope.camera.Site + "-入口";
                }
                if($scope.camera.TaskType==='1'){
                    $scope.CameraNow = $scope.camera.Site + "-出口";
                }
                if($scope.camera.TaskType==='2'){
                    $scope.CameraNow = $scope.camera.Site + "-出入口";
                }
                /*alert(result.data.data[0].orgName);*/
            }, function (reason) {

            });

            //异步同步数据方法Synchronous Data
        }, function (reason) {

        });
    }
    //获取摄像机名称

    $http({
        url: '/ma/query/camera',
        method: 'GET'
    }).then(function (result) {
        $scope.cameras = result.data.data;

        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });

    var Synchronous_Data = function () {
        $http({
            url: '/ma/config/getText',
            method: 'GET'
        }).then(function (result) {
            $scope.items = result.data.data;
            /*alert(result.data.data[0].orgName);*/
        }, function (reason) {

        });
    }
    //查询当前显示文字
    $http({
        url: '/ma/config/getTextNow',
        method: 'GET'
    }).then(function (result) {
        $scope.disPlay = result.data.data;
        $scope.configText=$scope.disPlay.ContentId;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    //查询当前CS端显示系统
    $http({
        url: '/ma/config/getCSTextNow',
        method: 'GET'
    }).then(function (result) {
        $scope.csConfig = result.data.data;
        $scope.CsText=$scope.csConfig.PanelId;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    //查询当前使用的摄像机
    $http({
        url: '/ma/config/getCameraNow',
        method: 'GET'
    }).then(function (result) {
        $scope.camera = result.data.data;
        if($scope.camera.TaskType==='0') {
            $scope.CameraNow = $scope.camera.Site + "-入口";
        }
        if($scope.camera.TaskType==='1'){
            $scope.CameraNow = $scope.camera.Site + "-出口";
        }
        if($scope.camera.TaskType==='2'){
            $scope.CameraNow = $scope.camera.Site + "-出入口";
        }
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
};
