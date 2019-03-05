/**
 * Created by Administrator on 2017/6/8.
 */

app.controller('DeleteGroRightCtrl', function ($scope, $modalInstance,$http, $state, OrgService) {

    $scope.currentApp = OrgService.get();

    var appId = $scope.currentApp.id;

    $scope.submit = function () {
         if(appId==='1'){
             alert("该组为根组不能删除");
             $modalInstance.dismiss('cancel');
         }else{
             $http({
                 url:"/ma/org/"+appId,
                 method:"DELETE",
             }).then(function success(response){
                 alert("删除成功！");
                 $modalInstance.close();
             },function error(){
                 console.log("error");
             });
         }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


