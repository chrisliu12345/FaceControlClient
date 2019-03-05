/**
 * Created by Administrator on 2017/12/21 0021.
 */
app.controller('CamEditCtrl', function ($scope, $rootScope, $resource, $http, $state, $modalInstance,Camera,CameraService) {
     var vm=this;
    $scope.camera=CameraService.get();
    console.log($scope.camera);
    vm.updateCamera=function () {
        console.log($scope.camera.TaskType);
        if($scope.camera.TaskType!=="0"&&$scope.camera.TaskType!=="1"&&$scope.camera.TaskType!=="2"){
            alert("请选择任务类型");
        }
        else{
        $http({
            method:"POST",
            url:"/ma/camera/update",
            data:$scope.camera
        }).success(function(response){
            if(response.code=='success'){
                alert("修改完成");
            }else{
                alert("系统错误，修改失败");
            }
            //$state.go('app.config', {}, {reload: true});
            $modalInstance.close();
        }).error(function(){

        });
        }
    }
    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});