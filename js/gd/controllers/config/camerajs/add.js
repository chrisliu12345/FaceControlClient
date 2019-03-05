/**
 * Created by Administrator on 2018/2/7 0007.
 */
app.controller('addCameraCtrl', function ($scope,$rootScope, $modal, $http, $resource, $modalInstance, $state) {
    var vm=this;
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
            }
            else{
                console.log("消息发送失败！");
            }
        }
    }
    this.submit = function () {
        console.log($scope.camera.location);
        if($scope.camera.location===null ||$scope.camera.location===undefined){
            alert("请选择布控地点");
            return;
        }else{
            if($scope.camera.ProtocolType==='HIK'){
                $scope.camera.Port="8000";
            }else if($scope.camera.ProtocolType==='DH'){
                $scope.camera.Port="37777";
            }else if($scope.camera.ProtocolType==='UNIVIEW'){
                $scope.camera.Port="8000";
            }
            $http({
                method:"POST",
                url:"/ma/camera/add",
                data:$scope.camera
            }).success(function(response){
                if(response.code==='200'){
                    $scope.collectCamId=response.data1;
                    var CsIp=response.data2;
                    alert("添加成功");
                    //新增摄像机给CS端发送消息
                    vm.sendCs($scope.collectCamId);
                    $modalInstance.close();
                }else{
                    alert(response.code);
                }

            }).error(function(){

            });
        }
    };
    //给CS端发送数据
    vm.sendCs=function (data) {
        var param=[{"camerID":data}];
            $http({
                url: '/ss/StartRecognize',
                method: 'POST',
                data:param
            }).then(function (result) {
            }, function (reason) {
                console.log("消息未发送");
            });
    }
    //获取考勤地点列表
    $http({
        url: '/ma/orgtree/cameraLoaction',
        method: 'GET'
    }).then(function (result) {
        $scope.locations = result.data.data;
        $scope.camera.location=$scope.locations[0].AttendanceLocationID;
    }, function (reason) {

    });
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

   //获取服务摄像机列表
    $http({
        url: '/ma/video/getServices',
        method: 'GET',
    }).then(function (result) {
        $scope.csServices = result.data.data;
        $scope.camera.ServiceIP=$scope.csServices[0].ServiceId;
    }, function (reason) {
        console.log(reason);
    });

});