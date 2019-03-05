/**
 * Created by Administrator on 2017/12/19 0019.
 */

app.factory("Camera", function ($resource) {
 return $resource("/ma/camera/:id", {id: "@id"}, {
     update: {
         method: 'PUT',
     }
 });
 });
app.factory("CameraService", function () {
    var service = {};
    var userInfo;
    service.get = function () {
        return userInfo;
    };
    service.set = function (newUserInfo) {
        userInfo = newUserInfo;
    };
    return service;
});

app.controller('CamCtrl', userCtrl);

function userCtrl($scope, $rootScope, $http,  $modal ,Camera, CameraService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.cameras=[];
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

  
    Camera.get(function (data) {
        vm.cameras = data.data;
        //根据任务代号修改为对应的名称

        for(var i=0;i<vm.cameras.length;i++){
            if(vm.cameras[i].TaskType==='0'){
                vm.cameras[i].TaskType='入口';
            }
            if(vm.cameras[i].TaskType==='1'){
                vm.cameras[i].TaskType='出口';
            }
            if(vm.cameras[i].TaskType==='2'){
                vm.cameras[i].TaskType='出入口';
            }
        }
        $scope.dtDataset = vm.cameras;
    });

    var update_data=function () {
        Camera.get(function (data) {
            vm.cameras = data.data;
            //根据任务代号修改为对应的名称
            for(var i=0;i<vm.cameras.length;i++){
                if(vm.cameras[i].TaskType==='0'){
                    vm.cameras[i].TaskType='入口';
                }
                if(vm.cameras[i].TaskType==='1'){
                    vm.cameras[i].TaskType='出口';
                }
                if(vm.cameras[i].TaskType==='2'){
                    vm.cameras[i].TaskType='出入口';
                }
            }
            $scope.dtDataset = vm.cameras;
        });
    }
    $scope.add=function () {
        var modalInstance = $modal.open({
           /* animation: vm.animationsEnabled,*/
            templateUrl: 'tpl/gd/config/camera/add.html',
            controller: 'addCameraCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
        modalInstance.result.then(function() { //模态框关闭后返回函数，selectedItem为返回值
            update_data();
        })
    };
    vm.remove= function (index) {

        var re = vm.cameras[index];
        CameraService.set(re);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/config/camera/delete.html',
            controller: 'DeleteCtrl',
            controllerAs: 'deleteVm',
            size: 'sm'
        });
        modalInstance.result.then(function() { //模态框关闭后返回函数，selectedItem为返回值
            update_data();
        })

    };

    vm.edit = function (index) {
        console.log("edit:" + index);
        var a = vm.cameras[index];
        console.log(a);
        CameraService.set(a);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/config/camera/edit.html',
            controller: 'CamEditCtrl',
            controllerAs: 'editVm',
            backdrop: "static"
        });
        modalInstance.result.then(function() { //模态框关闭后返回函数，selectedItem为返回值
            update_data();
        })
    };
    vm.showClient = function (index) {
        var s1 = vm.cameras[index];
        $http({
            url: '/ma/config/addCamera1',
            method: 'POST',
            data: s1.CamerId
        }).then(function (result) {
            $scope.selectCamandSer = result.data.data1;
            alert("设置成功！");
            //给CS端发送消息
            change('http://'+$scope.selectCamandSer+':2341?UpdateShowVideo=1&CameraID=' + s1.CamerId);
            Camera.get(function (data) {
                vm.cameras = data.data;
                //根据任务代号修改为对应的名称

                for(var i=0;i<vm.cameras.length;i++){
                    if(vm.cameras[i].TaskType==='0'){
                        vm.cameras[i].TaskType='入口';
                    }
                    if(vm.cameras[i].TaskType==='1'){
                        vm.cameras[i].TaskType='出口';
                    }
                    if(vm.cameras[i].TaskType==='2'){
                        vm.cameras[i].TaskType='出入口';
                    }
                }
                $scope.dtDataset = vm.cameras;
            });
        });
    };

    function createXMLHttpRequest()
    {
        if(window.XMLHttpRequest){
            xmlrequest=new XMLHttpRequest();
        }
        else if (window.ActiveXObject){
            try{
                xmlrequest=new ActiveXObject("Msxml2.XMLHTTP");
            }catch (e){
                try {
                    xmlrequest=new ActiveXObject("Microsoft.XMLHTTP")
                }
                catch(e){

                }
            }
        }
    }
    function change(urls)
    {
        createXMLHttpRequest();
        var url=urls;
        xmlrequest.onreadystatechange=processReponse;
        xmlrequest.open("GET",url,true);
        xmlrequest.send(null);
    }
    function processReponse()
    {
        if(xmlrequest.readyState===4){
            if(xmlrequest.status===200){
                console.log("发送到CS端消息成功!");
            }
            else{
                console.log("消息发送失败！");
            }
        }
    }

    /**
     * datatable参数设置
     */
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[1, 'asc']])
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
        DTColumnBuilder.newColumn('Site')
            .withTitle('位置名称'),
        DTColumnBuilder.newColumn('url')
            .withTitle('URL'),
        DTColumnBuilder.newColumn('TaskType')
            .withTitle('任务类型'),
        DTColumnBuilder.newColumn('ServiceIp')
            .withTitle('所属服务器IP'),
        DTColumnBuilder.newColumn('temp')
            .withTitle('客户端显示'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.edit(' + index + ')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="修改"></i></a>' +
                    '<a type="button" ng-click="showCase.remove(' + index + ')" class="btn btn-danger btn-xs"><i class="fa fa-trash-o" tooltip="删除"></i></a>'+
                    '<a type="button" ng-click="showCase.showClient(' + index + ')" class="btn btn-success btn-xs"><i class="glyphicon glyphicon-eye-open" tooltip="设为默认显示"></i></a>';
            })
    ];

    //注册"BatchUpdateUserOrg"的事件监听函数
    vm.successUpdateNum = 0;
    vm.failUpdateNum = 0;
    $scope.$on("BatchUpdateUserOrg", function (event, args) {
        // console.log(args.orgId);
        // console.log(args.org);
        var UPDATE_USER_ORG_URL = '/ma/user';
        for (var i = 0; i < $scope.selectedUser.length; i++) {
            $scope.selectedUser[i].orgId = args.orgId;
            $scope.selectedUser[i].org = args.org;

            $http.put(UPDATE_USER_ORG_URL, $scope.selectedUser[i])
                .then(
                    function (response) {
                        console.log(response);
                        vm.successUpdateNum++;
                        if ((vm.successUpdateNum + vm.failUpdateNum) === $scope.selectedUser.length) {
                            $state.go('app.user', {}, {reload: true});
                        }
                    },
                    function () {
                        vm.failUpdateNum++;
                        console.log("错误");
                    }
                );
        }
    });
    //打开批量操作的模态框
    vm.batchUpdateUserOrg = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/batchUpdateUserOrg.html',
            controller: 'batchUpdateUserOrgCtrl',
            controllerAs: 'showCase',
            backdrop: "static"
        });
    };

    // 这个是用于监听modal发出批量删除的消息，然后执行删除操作
    // 暂时没用这个方法
    $scope.$on('DeleteUsers', function (event, data) {
        if ("ok" === data) {
            var deleteIds = [];
            $scope.selectedUser.forEach(function (item) {
                deleteIds.push(item.id)
            });

            User.delete({
                id: deleteIds
            }, function (reult) {
                $state.go('app.user', {}, {reload: true})
            }, function (reason) {
                alert('delete error ' + reason);
            });
        }
    });


    vm.batchExitUser = function () {

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/edits.html',
            controller: 'batchExitCtrl',
            controllerAs: 'editsCase',
            backdrop: "static",
            size: 'sm'
        });
    }
    vm.batchDeleteUser = function () {

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/user/delete.html',
            controller: 'DeleteUsersCtrl',
            backdrop: "static",
            size: 'sm'
        });

        modalInstance.result.then(function (data) {
                if ("ok" === data) {
                    var deleteIds = [];
                    $scope.selectedUser.forEach(function (item) {
                        deleteIds.push(item.id)
                    });

                    User.delete({
                        id: deleteIds
                    }, function (reult) {
                        $state.go('app.user', {}, {reload: true})
                    }, function (reason) {
                        alert('delete error ' + reason);
                    });
                }
            }, function (reason) {
                console.log(" canceled :" + reason);
            }
        )

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

