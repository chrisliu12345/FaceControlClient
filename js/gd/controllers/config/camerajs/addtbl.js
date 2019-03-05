/**
 * Created by Administrator on 2018/2/7 0007.
 */
app.controller('addTblCtrl', function ($scope,$rootScope, $http, $resource, $compile,DTColumnBuilder,DTOptionsBuilder, $state) {
    var vm=this;
    $scope.ui=1;
    /**
     * datatable参数设置
     */
    $scope.dtDataset = [];
    /**
     * datatable相关变量
     */
        //datatable的api实例变量
    var myTable;
    $scope.myTable = false;
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    //datatable当前页数据（用户）的临时数
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];
     //摄像机加入到考勤系统
    vm.add=function(index){
        $scope.cameraData={};
        $scope.cameraData.name=$scope.dtDataset[index].name;
        $scope.cameraData.IPAddress=$scope.dtDataset[index].IPAddress;
        $scope.cameraData.ResID=$scope.dtDataset[index].ResID;
        $http({
            method:"POST",
            url:"/ma/camera/addtbl",
            data:$scope.cameraData
        }).success(function(response){
            if(response.code===200){
                document.getElementById($scope.cameraData.ResID).innerHTML="<p style='color: red'>添加成功</p>";
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
        method: 'GET'
    }).then(function (result) {
        console.log("获取到结果");
        $scope.dtDataset = result.data.data;
    }, function (reason) {

    });


    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[1, 'asc']])
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                console.log("header call back");
                $scope.headerCompiled = true;
                $compile(header)($scope);
            }
        })
        .withOption('fnDrawCallback', function (oSettings) {
            currentPageUser = tempCurrentPageUser;
            tempCurrentPageUser = [];
            if ($scope.manual$applyTag) {
                /*$scope.$apply();*/
            }
        })
        .withOption('initComplete', function (settings, json) {
            $scope.manual$applyTag = true;
            $scope.myTable = true;
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(row)($scope);
        })
        .withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            tempCurrentPageUser.push(aData);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name')
            .withTitle('摄像机名称'),
        DTColumnBuilder.newColumn('ProtocolType')
            .withTitle('类型'),
        DTColumnBuilder.newColumn('Address')
            .withTitle('位置'),
        DTColumnBuilder.newColumn('IPAddress')
            .withTitle('IP地址'),
        DTColumnBuilder.newColumn('UsrName')
            .withTitle('用户名'),
        DTColumnBuilder.newColumn('Password')
            .withTitle('密码'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function (data, type, full, meta) {
                var index = $scope.dtDataset.indexOf(data);
                var index2=data.ResID
                return '<div id="'+index2+'"><a  type="button" ng-click="showCase.add(' + index + ')" class="btn btn-info btn-xs"><i class="glyphicon glyphicon-plus" tooltip="加入该设备"></i></a>' +
                '</div>';
            })
    ];

});
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

/*

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
}*/
