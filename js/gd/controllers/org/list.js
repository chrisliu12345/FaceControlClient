'use strict';
var orgUri = "/ma/orgtree/";
app.factory("OrgTree", function ($resource) {
    return $resource(orgUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("User", function ($resource) {
    return $resource("/ma/user/:id", {id: "@id"}, {
        update: {}
    });
});
app.factory("OrgService", function () {
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
//广播监听
app.factory("userListService", function ($rootScope) {
    return {
        change: function(n) {
            $rootScope.$broadcast("valueChange", n);

        }
    }
});
app.controller('orgCtrl', orgCtrl);

function orgCtrl($scope, $resource, $rootScope,$modal, $interval, OrgTree, OrgService, $state, $http,userListService) {
    var vm = this;
    $scope.gen=true;
    $scope.token = function () {
        var sto = $rootScope.token;
        return sto;
    };
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        console.log(treeNode);
        OrgService.set(treeNode);
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var checkNodes = zTreeObj.getNodesByParam('pId', treeNode.id, null);
        if (checkNodes === null || checkNodes.length <= 0) {
            $http({
                url: "/ma/orgtree/getCtree/" + treeNode.id,
                method: 'POST'
            }).success(function (response) {
                zTreeObj.addNodes(treeNode, response, true);

                zTreeObj.expandNode(treeNode, true);// 将新获取的子节点展开

            }).error(function () {
                alert("请求错误！");
            });
        } else {
            return;
        }

    };
    $scope.userInfoAsyncSuccess1=function (event, treeId, treeNode) {
        //选取对应部门的人员数据，并在列表中展开
        $http({
            url: "/ma/orgtree/showUserInfo/" + treeNode.id,
            method: 'POST'
        }).success(function (result) {
            userListService.change(result.data);
        }).error(function () {
            alert("请求错误！");
        });
        //展开节点数据
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var checkNodes = zTreeObj.getNodesByParam('pId', treeNode.id, null);
        if (checkNodes === null || checkNodes.length <= 0) {
            $http({
                url: "/ma/orgtree/getCtree/" + treeNode.id,
                method: 'POST'
            }).success(function (response) {
                zTreeObj.addNodes(treeNode, response, true);

                zTreeObj.expandNode(treeNode, true);// 将新获取的子节点展开

            }).error(function () {
                alert("请求错误！");
            });
        } else {
            return;
        }
    }
    //右击树菜单
    $scope.zTreeOnRightClick = function (event, treeId, treeNode) {
        $scope.tempNode=[];
        $scope.tempNode=treeNode;
            OrgService.set(treeNode);
            if(treeNode.num==='1') {
                $scope.GroupRightClick(event);
            }else{
                //$scope.PeopleRightClick(event);
        }
    }

   //组右键
    $scope.GroupRightClick=function (e) {
       e.preventDefault();
        //获取我们自定义的右键菜单
        var menu = document.querySelector("#menu");
        //根据事件对象中鼠标点击的位置，进行定位
        console.log(e.clientX+"***"+e.clientY);
        menu.style.left = (e.clientX-200) + 'px';
        menu.style.top = (e.clientY-100) + 'px';
        //改变自定义菜单的宽，让它显示出来
        menu.style.width = '170px';
        menu.style.backgroundColor = "white";
        document.querySelector('#menu').style.height = "auto";
    };
    /*$scope.PeopleRightClick=function (e) {
        e.preventDefault();
        //获取我们自定义的右键菜单
        //var menu = document.querySelector("#menu1");
        //根据事件对象中鼠标点击的位置，进行定位
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        //改变自定义菜单的宽，让它显示出来
        menu.style.width = '170px';
        menu.style.backgroundColor = "white";
        //document.querySelector('#menu1').style.height = "auto";
    }*/

    window.onclick = function (e) {
        //用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
        document.querySelector('#menu').style.height = 0;
        //document.querySelector('#menu1').style.height = 0;

    }
    //关闭页面后恢复window事件

    $scope.$on("$destroy", function (e) {
        window.onclick = function () {
        };
    });

 ////以上为初始化数据，不用更改////

    //右键添加部门
    $scope.addGroupRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/group/add.html',
            controller: 'AddGroRightCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });
    }

    //右键编辑部门
    $scope.editGroupRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/group/groupEdit.html',
            controller: 'EditGroRightCtrl',
            controllerAs: 'editVm',
            backdrop: "static"
        });
        modalInstance.result.then(function (event, treeId, treeNode,da) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.tempNode.tId);
            //获取更新后
            $http({
                url: "/ma/org/getGroupRightOne",
                method: "POST",
                data: node1.id
            }).then(function success(response) {
                var mm = response.data.data;
                node1.name = mm.orgName;
                treeObj.updateNode(node1);
            }, function error() {
                console.log("error");
            });
        });
    }
    //右键删除部门
    $scope.deleteGroupRight=function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/group/groupDelete.html',
            controller: 'DeleteGroRightCtrl',
            size: 'sm'
        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.tempNode.tId);
            treeObj.removeNode(node1);

        });
    }
    //添加人员
    $scope.addPeopleRight=function(){
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/people/add.html',
            controller: 'addPeoRightCtrl',
            controllerAs: 'addVm',
            backdrop: "static"
        });
    }
    //编辑人员信息
    $scope.editPeopleRight=function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/gd/org/people/edit.html',
            controller: 'EditPeopleRightCtrl',
            controllerAs: 'editVm',
            backdrop: "static"
        });
        modalInstance.result.then(function (data) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.tempNode.tId);
            $scope.oldNodel=node1;
            //获取更新后
            $http({
                url: '/ma/user/'+node1.id,
                method: 'GET',
            }).then(function success(response) {
                var mm = response.data.data;
                node1.name = mm.realName;
                if(node1.pId!==mm.orgId){
                    /*treeObj.removeNode($scope.oldNodel);*/
                   // treeObj.updateNode(node1);
                    console.log(data);
                    //treeObj.addNodes(data, node1, true);
                   // treeObj.expandNode(data, true);
                }else{
                    treeObj.updateNode(node1);
                }
            }, function error() {
                console.log("error");
            });
        });
    };
    //删除该人员
    $scope.deletePeopleRight=function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/org/people/delete.html',
            controller: 'DeletePeoRightCtrl',
            size: 'sm'
        });
        modalInstance.result.then(function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node1 = treeObj.getNodeByTId($scope.tempNode.tId);
            treeObj.removeNode(node1);

        });
    }
    //导出组织机构
    $scope.exportGroupsRight=function () {
        $http({
            method: "GET",
            url: "ma/org/exportGroups/"+OrgService.get().id,
            headers: {
                Authorization: $rootScope.tokens
            },
            responseType: 'arraybuffer'

        }).then(function successCallback(data) {
                var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});
                var objectUrl = URL.createObjectURL(blob);
                var aForExcel = $("<a><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                $("body").append(aForExcel);
                $(".forExcel").click();
                aForExcel.remove();
            }
            , function errorCallback() {
                alert("无法导出，数据错误或者无记录！");
            });
    }
}



