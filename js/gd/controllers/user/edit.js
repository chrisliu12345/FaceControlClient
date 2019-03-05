'use strict';

app.controller('EditUserCtrl', function ($scope, $rootScope, $resource, $http,$modal, $state, $modalInstance,
                                         User, UserService,$interval,FileUploader,$timeout,CsResultService) {
    $scope.showPictureList=false;
    $scope.wait=false;
    // 从list界面获取user信息
    $scope.user = UserService.get();
    console.log($scope.user);
    //获取部门列表
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
        //$scope.temp="("+user.parentorg+")"+user.org;
    }, function (reason) {

    });
    //初始化考勤地点
    $http({
        url: '/ma/orgtree/cameraLoaction',
        method: 'GET'
    }).then(function (result) {
        $scope.locations = result.data.data;
    }, function (reason) {

    });
    //获取当前考勤地点
    $http({
        url: '/ma/orgtree/locationNow',
        method: 'POST',
        data:$scope.user.autoGraph
    }).then(function (result) {
        $scope.locationNow = result.data.data;
        $scope.autoGraphTmp=$scope.locationNow.AttendanceLocationID;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    //获取样本照片
    $http({
        url: '/ma/user/getSimplePhotoByOne',
        method: 'POST',
        data:$scope.user.CollectId
    }).then(function (result) {
        $scope.simplePhotos=result.data.data;
        $scope.urlRoot=result.data.urlRoot;
    }, function (reason) {

    });

    //点击删除照片
    $scope.deletePictrure=function (ids,wait) {
        $http({
            url: '/ma/user/deleteSimplePhotoByOne',
            method: 'POST',
            data:ids
        }).then(function (result) {
            $scope.simplePhotos[wait].shows=true;
        }, function (reason) {

        });
    }
    this.submit = function () {

        if($scope.temp===undefined||$scope.temp==="") {
        }else{

            var slist=$scope.temp.split("|");
            //alert(slist[0]+"///"+slist[1]);
            $scope.user.org=slist[1];
            $scope.user.parentorg=slist[0];
            $scope.user.orgId=slist[2];
        }
        if($scope.autoGraphTmp===undefined||$scope.autoGraphTmp===null){
        }else{
            $scope.user.autoGraph=$scope.autoGraphTmp;
        }

        $http({
            url: '/ma/user/',
            method: 'PUT',
            data:$scope.user
        }).then(function (result) {
            if($scope.queryItem===1){
                pictureUpload();
            }else{
                alert("修改成功");
                // $state.go('app.user', {}, {reload: true});
                 $modalInstance.close($scope.user);
            }
        }, function (reason) {

        });

    };
    //照片修改上传
    var pictureUpload=function () {
        $http({
            url: '/ma/userAdd/userSessionExit',
            method: 'POST',
            data:$scope.user
        }).then(function (result) {
            $scope.resultData=result.data;
            if($scope.resultData.data==='no'){
                alert("用户已存在");
            }else{
                uploader.uploadAll();

                //定时轮巡获取CS端返回的结果
                $scope.wait=true;

                //设置等待画面，
                //轮训数据
                var timeConfig = $interval(function () {
                    $http({
                        url: '/ma/user/CsResult/1/1',
                        method: 'GET'
                    }).then(function (result) {
                        if(result.data.code==='success'){
                            $scope.wait=false;
                            CsResultService.set(result.data.data);
                            //关闭等待画面，进入下面的图像展示功能
                            $modalInstance.dismiss('cancel');
                            var modalInstance = $modal.open({
                                templateUrl: 'tpl/gd/user/callBack.html',
                                controller: 'callBackCtrl',
                                controllerAs: 'csVm',
                                backdrop: "static"
                            });
                            $scope.$on('$destroy', function () {
                                $interval.cancel(timeConfig);
                            });
                        }
                        if(result.data.code === 'user exist'){
                            $scope.wait = false;
                            $scope.$on('$destroy', function () {
                                $interval.cancel(timeConfig);
                            });
                            alert("发生系统错误，请重试");
                        }

                    }, function (reason) {
                    });
                }, 5000, -1);
            }
        }, function (reason) {
        });

    };
    //给CS端发送数据
    var sendCs=function () {
        $http({
            url: '/ma/user/getCsResult',
            method: 'GET'
        }).then(function (result) {
            console.log('/ss/?ReadyPictData=1&CollectId='+result.data.data);
            $http({
                url: '/ss/?ReadyPictData=1&CollectId='+result.data.data,
                method: 'GET'
            }).then(function (result) {
            }, function (reason) {
            });
        }, function (reason) {
        });
    }


    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    var uploader = $scope.uploader = new FileUploader({
        url:'ma/userAdd/simpleUserPicImportEdit',
        headers:{
            Authorization:$scope.token
        }
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.log(uploader.queue);
        console.info('onAfterAddingAll', addedFileItems);
        if(uploader.queue.length>0){
            $scope.queryItem=1;
        }else{
            $scope.queryItem=0;
        }

    };
    uploader.onBeforeUploadItem = function(item) {

        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        //给CS端发送数据
        $timeout(function () {
            sendCs();
        }, 3000);
    };

    console.info('uploader', uploader);

});