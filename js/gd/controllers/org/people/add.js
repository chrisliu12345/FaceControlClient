'use strict';

app.controller('addPeoRightCtrl', function( $scope, $http, $resource, $modalInstance, $state, User,OrgService) {
    $scope.user = {};
    $scope.user.orgs=[];
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
    }, function (reason) {

    });


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    this.submit = function () {
             console.log(OrgService.get());
        var form = new FormData(document.getElementById("tf"));
        $http({
            url: '/ma/user/addPicture',
            method: 'POST',
            data:form,
            transformRequest: angular.identity,
            headers : {
                'Content-Type' : undefined ,
                Authorization : $scope.token
            }
        }).then(function (result) {

            $scope.user.orgId=OrgService.get().id;
            $scope.user.picture=result.data.uuid;
            $http({
                url: '/ma/user/addOrgUser',
                method: 'POST',
                data:$scope.user
            }).then(function (response) {
                alert("添加成功");
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var civil=OrgService.get();
                if(civil.children !==undefined){
                    treeObj.addNodes(civil, response.data.data, true);
                    treeObj.expandNode(civil, true);
                }else{
                    $scope.expandNodes2();
                }
                $modalInstance.close();
            }, function (reason) {

            });
        }, function (reason) {
            alert("新增人员必须添加证件照！" );
        });

    };
    //展开所选的节点
    $scope.expandNodes2 = function (event, treeId, treeNode) {
        var tt=OrgService.get();
        // console.log(tt);
        $http({
            url: "/ma/orgtree/getCtree/" + tt.id,
            method: 'POST'
        }).success(function (response) {
            var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
            zTreeObj.addNodes(tt, response, true);
            zTreeObj.expandNode(tt, true);// 将新获取的子节点展开

        }).error(function () {
            alert("请求错误！");
        });
    };

});