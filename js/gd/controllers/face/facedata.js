'use strict';
var faceUri = "/ma/face/";
app.factory("FaceData", function ($resource) {
    return $resource(faceUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("FaceDataService", function () {
    var service = {};
    var face;
    service.get = function () {
        return face;
    };
    service.set = function (newOrg) {
        face = newOrg;
    };
    return service;
});

app.controller('FaceDataCtrl', vdCtrl);


function vdCtrl($scope, $resource, $rootScope, $modal, FaceData, FaceDataService, $state, $http) {
    var vm = this;
    $scope.registered=[];
    $scope.tree = {};
    $scope.my_tree = $scope.tree = {};
    $scope.tree_data = [];
    $scope.xianshi=true;
    $scope.selectedUser=[];
    $scope.UnselectedUser=[];
    $scope.progress_bar=0;
    $scope.ztreeOnAsyncSuccess1 = function (event, treeId, treeNode) {
        console.log(treeNode);
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var checkNodes = zTreeObj.getNodesByParam('pId', treeNode.id, null);
        if (checkNodes === null || checkNodes.length <= 0) {
            $http({
                url: "/ma/face/"+treeNode.id,
                method: 'POST'
            }).success(function (response) {
                zTreeObj.addNodes(treeNode, response, true);

                zTreeObj.expandNode(treeNode, true);// 将新获取的子节点展开

            }).error(function () {
                alert("无更新人员！");
            });
        } else {
            return;
        }

    };
    $scope.zTreeOnClick=function (event, treeId, treeNode) {
        if (treeNode.num === '2') {
        var collectID = treeNode.collectId;
        registerPicture(collectID);
       }
    }
    var registerPicture=function (xs,xt) {
        //查找已注册的照片
        $http({
            url: '/ma/face/getPicture1/'+xs,
            method: 'POST',
            data:xs
        }).then(function (response) {
            $scope.registered = response.data.data;
            for(var i=0;i< $scope.registered.length;i++){
                if($scope.selectedUser.indexOf($scope.registered[i].id)===-1){
                    $scope.selectedUser.push($scope.registered[i].id);
                }
            }
        }, function (reason) {

        });
        //查找待更新的照片
        $http({
            url: '/ma/face/getPicture2/'+xs,
            method: 'POST',
            data:xs
        }).then(function (response) {
            $scope.waitUpdate = response.data.data;
            for(var i=0;i<$scope.waitUpdate.length;i++){
                $scope.waitUpdate[i].SelectedFlag=1;
                $scope.selectedUser.push($scope.waitUpdate[i].id);
            }
        }, function (reason) {

        });
    }
    vm.updateAll=function () {
        //将选中的照片SelectedFlag制为1
        $scope.progress_bar=0;
        $http({
            url: '/ma/face/updateSelectedFlag1',
            method: 'POST',
            data: $scope.selectedUser
        }).then(function (result) {
            //将没选中的照片SelectedFlag制为0
            $scope.progress_bar=50;
            $http({
                url: '/ma/face/updateSelectedFlag2',
                method: 'POST',
                data: $scope.UnselectedUser
            }).then(function (result) {
                $http({
                    url: '/ss/?Modeling=3',
                    method: 'GET',
                }).then(function (result) {
                    $scope.progress_bar=100;
                }, function (reason) {
                });

            }, function (reason) {
            });
        }, function (reason) {
        });
    }

    //执行照片选择
    vm.updateSelectionOne = function ($event, index) {
        console.log(index);
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        updateSelected(action, index);
    };
    //实际更新被选中用户的数组的方法

    var updateSelected = function (action, user) {

        if (action === 'add' && $scope.selectedUser.indexOf(user.id) === -1) {
            $scope.selectedUser.push(user.id);
            //如果删除后又添加了，就把删除的照片里的list再删除
            if($scope.UnselectedUser.indexOf(user.id)!==-1){
            $scope.UnselectedUser.splice(idx, 1);
            }
        }
        if (action === 'remove' && $scope.selectedUser.indexOf(user.id) !== -1) {
            var idx = $scope.selectedUser.indexOf(user.id);
            $scope.UnselectedUser.push(user.id);
            //把已移除的照片加到另一个list里。
            $scope.selectedUser.splice(idx, 1);

        }

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

