'use strict'

app.controller('AddGroRightCtrl', function ($rootScope, $scope, $modal, $http, $resource, $modalInstance, $state,OrgService) {

    this.submit = function () {
            //添加子组
            $scope.gro.ParentID = OrgService.get().id;
            $scope.gro.parentName=OrgService.get().name;
        $http({
            url: "/ma/org",
            method: "POST",
            data: $scope.gro
        }).then(
            function success(response) {
                $modalInstance.dismiss('cancel');
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var civil=OrgService.get();
                if(civil.children !==undefined){
                    treeObj.addNodes(civil, response.data.data, true);
                    treeObj.expandNode(civil, true);
                }else{
                    $scope.expandNodes2();
                }
            }, function error() {
                alert("虚拟组ID已存在，请重新填写。");
            });
    };
    //取消
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //展开所选的节点
    $scope.expandNodes2 = function (event, treeId, treeNode) {
        var tt=OrgService.get();
       // console.log(tt);
        $http({
            url: "/ma/orgtree/getCtree/" + tt.id,
            method: 'POST',
        }).success(function (response) {
            var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
            zTreeObj.addNodes(tt, response, true);
            zTreeObj.expandNode(tt, true);// 将新获取的子节点展开

        }).error(function () {
            alert("请求错误！");
        });
    };
});