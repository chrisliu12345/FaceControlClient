/**
 * Created by Administrator on 2017/12/21 0021.
 */


// 批量删除对应的controlller
app.controller('DeleteCtrl', function ($scope,$rootScope, $http,$state, $modal,CameraService,$modalInstance ) {
    var vm=this;
    $scope.camera=CameraService.get();
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
        console.log("到我这里了！")
        xmlrequest.open("GET",url,true);
        xmlrequest.send(null);
    }
    function processReponse()
    {
        if(xmlrequest.readyState===4){
            if(xmlrequest.status===200){
                console.log("发送到CS端消息成功!");
                $scope.deleteResult();
            }
            else{
                console.log("消息发送失败！");
            }
        }
    }
    vm.submit = function () {
        //删除摄像机前，先判断是否删除的为当前摄像机
        $http({
            method:"POST",
            url:"/ma/camera/judgeDelete",
            data: $scope.camera

        }).success(function(response){
            console.log(response.servip);
            if(response.data==='yes'){
                alert("当前摄像机正在使用，无法删除，请切换至其他摄像机后再删除本摄像机！");
                return false;
            }else{
                //change('http://'+response.servip+':2341?DeleteCameraTask=0&CameraID='+$scope.camera.CamerId);
                //$scope.deleteResult();
                vm.sendCs($scope.camera.CamerId);
            }
        }).error(function(data){
            console.log("error"+data);
        });
    };
    //先向CS端发送删除消息等待返回结果后再删除.
    vm.sendCs=function (data) {
        var param=[{"camerID":data}];
        $http({
            url: '/ss/StopRecognize',
            method: 'POST',
            data:param,
            timeout:3000
        }).then(function (result) {
            console.log("与外界通信成功");
            $scope.deleteResult();
        }, function (reason) {
            console.log("与外界通信失败，直接删除");
            $scope.deleteResult();
        });
    }
    $scope.deleteResult=function(){
        $http({
            method:"POST",
            url:"/ma/camera/delete",
            data: $scope.camera

        }).success(function(response){
            alert("删除成功！");
            $modalInstance.close();
        }).error(function(data){
            console.log("error"+data);
        });
    }

   vm.submitAlertCountinue=function () {
       //如果选择的是当前摄像机，且还要删除，
       // 则执行此方法，删除对应的摄像机，并将列表中第一条摄像机作为当前摄像机
       $http({
           method:"POST",
           url:"/ma/camera/delete1",
           data: $scope.camera

       }).success(function(response){
           $modalInstance.close();
       }).error(function(data){
           console.log("error"+data);
       });
       //给CS端发送消息
       $http({
           method:"GET",
           url:"/ss?DeleteCameraTask=0&CameraID="+$scope.camera.CamerId
       }).success(function(response){
       }).error(function(data){
           console.log("error"+data);
       });
   }
    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});


