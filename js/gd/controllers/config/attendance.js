'use strict';

app.controller('AttendCtrl', stCtrl);

function stCtrl($scope, $resource, $rootScope, $modal, Config, ConfigService, $state, $http, FileUploader) {
    var vm = this;

    $scope.selected = [];
    var uploader = $scope.uploader = new FileUploader({
        url: 'ma/config/import',
        headers: {
            Authorization: $rootScope.token
        }
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
    $scope.uploadFileCode = function () {
        //提交excel
        submit();
        uploader.uploadAll();

        //提交表单

    };
    //添加地点
    $scope.addCameraLocation = function () {
        console.log($scope.camLocation);
        $http({
            url: "/ma/config/addCameraLocation",
            method: "POST",
            data: $scope.camLocation
        }).then(function success(response) {
            if (response.data.code === 'success') {
                alert("添加成功！");
            }else{
                alert("布控地点已存在，请重新填写！");
            }
        }, function error() {
            alert("错误");
        })
    }
    //导出考勤地点ID
    $scope.exportCameraLocation=function () {
        $http({
            method: "GET",
            url: "ma/config/exportCameraLocation",
            headers: {
                Authorization: $rootScope.tokens
            },
            responseType: 'arraybuffer'

        }).then(function successCallback(data) {
                var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});

                var objectUrl = URL.createObjectURL(blob);
                console.log(objectUrl);
                var aForExcel = $("<a download='布控地点记录.xls'><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                $("body").append(aForExcel);
                $(".forExcel").click();
                aForExcel.remove();
            }
            , function errorCallback() {
                alert("无法导出，数据错误或者无记录！");
            });
    }
    var submit = function () {

        $scope.attend = {};
        $scope.attend.Selected = $scope.selected.join(",");
        $scope.attend.StartTime = $scope.StartTime;
        $scope.attend.EndTime = $scope.EndTime;
        $scope.attend.StartRestTime = $scope.StartRestTime;
        $scope.attend.EndRestTime = $scope.EndRestTime;
        $scope.attend.StartWrok = $scope.StartWrok;
        $scope.attend.EndWork = $scope.EndWork;
        $scope.attend.NoWork = $scope.NoWork;
        $scope.attend.StartAddWorkTime = $scope.StartAddWorkTime;

        /* if( $scope.attend.StartTime!==undefined){*/
        $http({
            url: "/ma/config",
            method: "POST",
            data: $scope.attend
        }).then(function success(response) {
            if (response.data.code === 'success') {
                alert("配置成功！");
            }
        }, function error() {
            alert("错误");
        })
        /*}*/
    };
    //显示当前考勤设置信息
    $scope.viewNow = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/config/view.html',
            controller: 'ViewConfigCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"
        });
    }
    //在主页面显示当前考勤设置
    $http({
        url: "/ma/config",
        method: "GET",

    }).then(function success(response) {
        $scope.configs = response.data.data;
        for (var i = 0; i < $scope.configs.length; i++) {

            console.log($scope.configs[i].name);
            if ($scope.configs[i].name=== 'ClockIn') {
                $scope.StartTime = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'ClockOff') {
                $scope.EndTime = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'LunchTimeBegin') {
                $scope.StartRestTime = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'LunchTimeEnd') {
                $scope.EndRestTime = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'ClockInExtraTime') {
                $scope.StartWrok = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'ClockOffExtraTime') {
                $scope.EndWork = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'OffDutyTime') {
                $scope.NoWork = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'OvertimeBegin') {
                $scope.StartAddWorkTime = $scope.configs[i].value;
            }
            if ($scope.configs[i].name === 'WorkingDays') {
                $scope.Days = $scope.configs[i].value;
                var works = $scope.Days.split(",");
                for (var k = 0; k < works.length; k++) {
                    if (works[k] === "星期一") {
                        document.getElementById("1").checked = true;
                        $scope.selected.push(works[k]);
                    }
                    if (works[k] === "星期二") {
                        document.getElementById("2").checked = true;
                        $scope.selected.push(works[k]);
                    }
                    if (works[k] === "星期三") {
                        document.getElementById("3").checked = true;
                        $scope.selected.push(works[k]);
                    }
                    if (works[k] === "星期四") {
                        document.getElementById("4").checked = true;
                        $scope.selected.push(works[k]);
                    }
                    if (works[k] === "星期五") {
                        document.getElementById("5").checked = true;
                        $scope.selected.push(works[k]);
                    }
                    if (works[k] === "星期六") {
                        document.getElementById("6").checked = true;
                        $scope.selected.push(works[k]);
                    }
                    if (works[k] === "星期日") {
                        document.getElementById("7").checked = true;
                        $scope.selected.push(works[k]);
                    }
                }
            }

        }
    }, function error() {
        alert("错误");
    })

    var updatedSelected = function (action, id, name) {
        if (action === 'add' && $scope.selected.indexOf(id) === -1) {
            $scope.selected.push(name);

        }
        if (action === 'remove') {
            for (var i = 0; i < $scope.selected.length; i++) {

                if ($scope.selected[i] === name) {
                    $scope.selected.splice(i, 1);
                }
            }
        }
    }
    $scope.updateedSelect = function ($event, id) {

        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updatedSelected(action, id, checkbox.name);
    }
    ;
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
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        alert("上传成功");
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
        console.info('onCompleteAll');
    };

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

app.directive('ngTimeD', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function ($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            $('.form_time').datetimepicker({
                language: 'fr',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 1,
                minView: 0,
                maxView: 1,
                forceParse: 0
            });
        },
    };
});

