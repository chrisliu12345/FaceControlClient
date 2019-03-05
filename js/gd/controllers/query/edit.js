/**
 * Created by Administrator on 2017/12/21 0021.
 */
app.controller('FaceEditCtrl', function ($scope, $resource, $http, $state, $modalInstance,QueryService) {
     var vm=this;
    $scope.edits=QueryService.get();
    //获取部门列表
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    var checkName=$scope.checkName=  function(){
        var diff=$scope.edits.orgs.split("|");
        $scope.edits.parentOrg=diff[0];
        $scope.edits.org=diff[1];
        $scope.edits.orgId=diff[2];
        $http({
            url: '/ma/user/queryUserinfo',
            method: 'POST',
            data:$scope.edits
        }).then(function (result) {

            $scope.Lusers = result.data.data;
            console.log($scope.Lusers);
            /*alert(result.data.data[0].orgName);*/
        }, function (reason) {

        });
    }
    vm.updateDectImg=function () {
        var namff=$scope.edits.NewName.split("|");
        $scope.edits.NewEmployee=namff[1];//新员工号
        $scope.edits.CollectId=namff[0];
        $http({
            method:"POST",
            url:"/ma/query/updateDectImg",
            data:$scope.edits
        }).success(function(response){

            if(response.data==='success'){
                alert("修改完成");
            }else{
                alert("系统错误，修改失败");
            }
            $state.go('app.query', {}, {reload: true});
            $modalInstance.close();
        }).error(function(){

        });
    }
    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});