'use strict';

app.controller('EditPeopleRightCtrl', function ($scope, $rootScope, $resource, $http, $state, $modalInstance,
                                         User, OrgService) {

    // 获取user信息
    $http({
        url: '/ma/user/'+OrgService.get().id,
        method: 'GET',
    }).then(function (result) {
        $scope.user= result.data.data;
        //获取当前考勤地点
        $http({
            url: '/ma/orgtree/locationNow',
            method: 'POST',
            data:$scope.user.autoGraph
        }).then(function (result) {
            $scope.locationNow = result.data.data;
            //初始化考勤地点
            $http({
                url: '/ma/orgtree/cameraLoaction',
                method: 'GET'
            }).then(function (result) {
                $scope.locations = result.data.data;
                $scope.autoGraphTmp=$scope.locationNow.AttendanceLocationID;
            }, function (reason) {

            });
        }, function (reason) {

        });
    }, function (reason) {

    });
    //获取部门列表
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });


    this.submit = function () {
        if($scope.temp===undefined||$scope.temp===null) {
        }else{
            var slist=$scope.temp.split("|");
            //alert(slist[0]+"///"+slist[1]);
            $scope.user.org=slist[1];
            $scope.user.parentorg=slist[0];
            $scope.user.orgId=slist[2];
            //用新修改的部门ID查询该部门，并返回一个tree的节点数据
            $http({
                url: '/ma/orgtree/treeNodes',
                method: 'POST',
                data:$scope.user.orgId
            }).then(function (result) {
               $scope.newTreeNode=result.data.data;
               alert("我是树节点"+$scope.newTreeNode);
            }, function (reason) {

            });
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
            alert("修改成功");
            $modalInstance.close($scope.oldTreeNode);
        }, function (reason) {

        });

    };

    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});