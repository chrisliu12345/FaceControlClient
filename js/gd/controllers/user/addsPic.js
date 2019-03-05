/**
 * Created by Administrator on 2017/12/14 0014.
 */
'use strict'

app.controller('addUsersPicCtrl', ['$http', '$scope','$state', '$timeout', '$interval', '$modal', 'FileUploader', '$modalInstance', 'CsResultService', function ($http, $scope, $state, $timeout, $interval, $modal, FileUploader, $modalInstance, CsResultService) {
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.wait = false;
    $scope.user = {};
    $scope.user.orgs = [];
    //初始化组
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
    }, function (reason) {

    });
    //初始化考勤地点
    $http({
        url: '/ma/orgtree/cameraLoaction',
        method: 'GET'
    }).then(function (result) {
        $scope.locations = result.data.data;
        $scope.user.autoGraph = $scope.locations[0].AttendanceLocationID;
    }, function (reason) {

    });

    var uploader = $scope.uploader = new FileUploader({
        url: 'ma/userExcel/userPicImport',
        headers: {
            Authorization: $scope.token
        },
        formData: $scope.user
    });

    $scope.userData = function () {
        $scope.user.orgId = $scope.user.orgs[0].id;
        $http({
            url: '/ma/userExcel/userSession',
            method: 'POST',
            data: $scope.user
        }).then(function (result) {
            uploader.uploadAll();
            // //设置等待画面，定时轮巡获取CS端返回的结果
            $scope.wait = true;
            //轮训数据
            var timeConfig = $interval(function () {
                $http({
                    url: '/ma/user/CsResult/1/1',
                    method: 'GET'
                }).then(function (result) {
                    if (result.data.code === 'success') {
                        $scope.wait = false;
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
                        alert("文件压缩方式不正确！请重试");
                    }
                }, function (reason) {
                });
            }, 30000, -1);
        }, function (reason) {

        });
    }
    //给CS端发送数据
    var sendCs = function () {

        $http({
            url: '/ma/user/getCsResult',
            method: 'GET'
        }).then(function (result) {
            $http({
                url: '/ss/Register',
                method: 'POST',
                data:result.data
            }).then(function (result) {
            }, function (reason) {
            });
        }, function (reason) {
        });

    };
    //删除csresult1中的数据
     var deletecsresult1=function () {
         $http({
             url: 'ma/user/deleteCsResult',
             method: 'GET'
         }).then(function (result) {
         }, function (reason) {
         });
     }

    $scope.uploadFileCode = function () {
        $scope.userData();
    };
    $scope.gotoOrg = function () {
        $modalInstance.dismiss('cancel');
        $state.go('app.user', {}, {reload: true});
    };

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        $scope.user.progress = progress;
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.log("上传完成");
        $timeout(function () {
            sendCs();
        }, 3000);
    };

    console.info('uploader', uploader);
}]);