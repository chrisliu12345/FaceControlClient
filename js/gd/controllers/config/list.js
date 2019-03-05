'use strict';
var saveUri = "/ma/config/";
app.factory("Config", function ($resource) {
    return $resource(saveUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("ConfigService", function () {
    var service = {};
    var org;
    service.get = function () {
        return org;
    };
    service.set = function (newOrg) {
        org = newOrg;
    };
    return service;
});

app.controller('configCtrl', ssCtrl);

function ssCtrl($scope, $resource, $rootScope, $modal, Config, ConfigService, $state, $http,FileUploader) {
    var vm = this;

  /*  var dm = document.getElementById("dataManager");

    var bd = document.getElementById("bigDisplay");*/

   /* dm.style.fontSize="";
    dm.setAttribute("class", "");

    bd.style.fontSize="";
    bd.setAttribute("class", "");*/
    document.getElementById("cameraConfig").style.fontSize="16px";
    vm.select_to_item=function (x) {
            $scope.name=x;
            $scope.ui=x;
        var cc = document.getElementById("cameraConfig");
        var ad = document.getElementById("addTbl");
        var ec = document.getElementById("examConfig");
        ec.style.fontSize="";
        ec.setAttribute("class", "");
        cc.style.fontSize="";
        cc.setAttribute("class", "");
        ad.style.fontSize="";
        ad.setAttribute("class", "");
        if (x === 1) {
            cc.style.fontSize="16px";
            cc.setAttribute("class", "label label-info");
        }
       /* if (x === 2) {
            dm.style.fontSize="16px";
            dm.setAttribute("class", "label label-info");
        }

        if (x === 4) {
            bd.style.fontSize="16px";
            bd.setAttribute("class", "label label-info");
        }*/
        if (x === 3) {
            ec.style.fontSize="16px";
            ec.setAttribute("class", "label label-info");
        }
        if (x === 5) {
            ad.style.fontSize="16px";
            ad.setAttribute("class", "label label-info");
        }

    }
    $scope.selected = [];
    var uploader = $scope.uploader = new FileUploader({

        url:'ma/config/import',
        headers:{
            Authorization:$rootScope.token
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
        uploader.uploadAll();
        submit();
        //提交表单

    };
    var submit=function () {

        $scope.attend={};
        $scope.attend.Selected=$scope.selected.join(",");
        $scope.attend.StartTime=$scope.StartTime;
        $scope.attend.EndTime=$scope.EndTime;
        $scope.attend.StartRestTime=$scope.StartRestTime;
        $scope.attend.EndRestTime=$scope.EndRestTime;
        $scope.attend.StartWrok=$scope.StartWrok;
        $scope.attend.EndWork=$scope.EndWork;
        $scope.attend.NoWork=$scope.NoWork;
        $scope.attend.StartAddWorkTime=$scope.StartAddWorkTime;
        $http({
            url:"/ma/config",
            method:"POST",
            data:$scope.attend
        }).then(function success(response){
           if(response.data.code==='success'){
               alert("配置成功！");
           }
        },function error(){
            alert("错误");
        })
    }



    var updatedSelected = function (action, id, name) {
        if (action === 'add' && $scope.selected.indexOf(id) === -1) {
            $scope.selected.push(name);

        }
        if (action === 'remove' ) {
            for(var i=0;i<$scope.selected.length;i++){

                if($scope.selected[i]===name){
                    $scope.selected.splice(i,1);
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

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
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

