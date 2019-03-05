'use strict';

/*
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
                scope.getFile();
            });
        }
    };
}]);
*/

app.controller('AddUserCtrl',  ['$http','$scope','$state','$timeout','$interval','$modal', 'FileUploader','$modalInstance','CsResultService', function( $http,$scope,$state,$timeout,$interval,$modal, FileUploader,$modalInstance,CsResultService) {
    $scope.user = {};
    $scope.user.orgs=[];
    $scope.wait=false;
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
        $scope.user.autoGraph=$scope.locations[0].AttendanceLocationID;
    }, function (reason) {

    });


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    this.submit = function () {
        $scope.user.orgId=$scope.user.orgs[0].id;
        $scope.user.org=$scope.user.orgs[0].orgName;
        $scope.user.parentorg=$scope.user.orgs[0].parentName;
        if($scope.user.policeNum===null||$scope.user.policeNum===""||$scope.user.policeNum===undefined){
            $scope.user.policeNum="无";
        }
        $http({
            url: '/ma/userAdd/userSession',
            method: 'POST',
            data:$scope.user
        }).then(function (result) {
            $scope.resultData=result.data;
            if($scope.resultData.data==='no'){
                alert("用户已存在");
            }else{
                uploader.uploadAll();

                //设置等待画面，定时轮巡获取CS端返回的结果
                  $scope.wait=true;
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
            method: 'GET',
        }).then(function (result) {
            console.log("开始给CS端发送数据 ");
            console.log("数据内容是: "+result.data);
            $http({
                url: '/ss/Register',
                method: 'POST',
                data:result.data
            }).then(function (result) {
            }, function (reason) {
            });
        }, function (reason) {
        });
    }

    ////删除importuser1的数据
    var deleteImportUser1=function () {
        $http({
            url: '/ma/userAdd/deleteSession',
            method: 'GET'
        }).then(function (result) {
        }, function (reason) {
        });
    };

    var uploader = $scope.uploader = new FileUploader({
        url:'ma/userAdd/simpleUserPicImport',
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


}]);

