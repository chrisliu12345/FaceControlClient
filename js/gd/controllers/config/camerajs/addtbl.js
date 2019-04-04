/**
 * Created by Administrator on 2018/2/7 0007.
 */
app.controller('addTblCtrl', function ($scope,$rootScope, $http) {
    var vm=this;
     //摄像机加入到考勤系统
    vm.add=function(index){
        $scope.cameraData={};
        $scope.cameraData.name=index.name;
        $scope.cameraData.IPAddress=index.IPAddress;
        $scope.cameraData.ResID=index.ResID;
        $http({
            method:"POST",
            url:"/ma/camera/addtbl",
            data:$scope.cameraData
        }).success(function(response){
            if(response.code===200){
                //向CS端发送新增摄像机消息
                vm.sendCs(response.data);
            }else{
                alert("已有数据，请勿重复操作");
            }
        }).error(function(){
        });
    };
    //摄像机从tbl表中删除
    vm.remove=function(index){
        $scope.cameraDelete={};
        $scope.cameraDelete=$scope.dtDataset[index].ResID;
        $http({
            method:"POST",
            url:"/ma/camera/deletetbl",
            data:$scope.cameraDelete
        }).success(function(response){
            document.getElementById($scope.cameraDelete).innerHTML="<p style='color: red'>删除成功</p>";
        }).error(function(){
            console.log("服务请求出现错误");
        });
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

    //初始化设备列表
    $http({
        url: '/ma/camera/tblCamera',
        method: 'POST',
        data:'0'
    }).then(function (result) {
        $scope.dtDataset = result.data.data;
    }, function (reason) {

    });
   //获取联网平台设备总数
    $http({
        url: '/ma/camera/resNum',
        method: 'GET'
    }).then(function (result) {
        $scope.dtCount= result.data;
    }, function (reason) {

    });
    layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function(){
        var laydate = layui.laydate //日期
            ,laypage = layui.laypage //分页
            ,layer = layui.layer //弹层
            ,table = layui.table //表格
            ,carousel = layui.carousel //轮播
            ,upload = layui.upload //上传
            ,element = layui.element //元素操作
            ,slider = layui.slider //滑块
        setTimeout(function () {
            table.render({
                elem: '#test'
                , height: 350
                , data: $scope.dtDataset
                , cols: [[
                    {field: 'Address', title: '父设备名称', fixed: 'left'}
                    , {field: 'name', title: '摄像机名称'},
                    {field: 'ProtocolType', title: '类型'},
                    {field: 'IPAddress', title: 'IP地址'},
                    {field: 'UsrName', title: '用户名'},
                    {field: 'Password', title: '密码'},
                    {fixed: 'right', width: 178, align: 'center', toolbar: '#barDemo'}
                ]]
            });
        },200);


            table.render({
                elem: '#test'
                ,height:350
                ,data:$scope.dtDataset
                ,cols: [[
                    {field:'Address', title:'父设备名称',  fixed: 'left'}
                    ,{field:'name', title:'摄像机名称'},
                    {field:'ProtocolType', title:'类型'},
                    {field:'IPAddress', title:'IP地址'},
                    {field:'UsrName', title:'用户名'},
                    {field:'Password', title:'密码'},
                    {fixed: 'right', width:178, align:'center', toolbar: '#barDemo'}
                ]]
            });
        table.on('tool(demo)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                vm.add(data);
                layer.msg('ID：'+ data.ResID + ' 加入成功！');
               obj.del();
            }
        });
        //分页
        setTimeout(function () {
            laypage.render({
                elem: 'pageDemo' //分页容器的id
                ,count: $scope.dtCount //总页数
                ,skin: '#1E9FFF' //自定义选中色值
                ,height:350
                ,jump: function(obj, first){
                    if(obj.curr===1){
                        $scope.pageNum='0';
                    }else{
                        $scope.pageNum=((obj.curr-1)*10).toString();
                    }
                    $http({
                        url: '/ma/camera/tblCamera',
                        method: 'POST',
                        data:$scope.pageNum
                    }).then(function (result) {
                        $scope.dtDataNew = result.data.data;
                        table.reload('test', {
                            data: $scope.dtDataNew
                            ,height:350
                        });

                    }, function (reason) {
                    });
                }
            });
        },200)

    });

});

