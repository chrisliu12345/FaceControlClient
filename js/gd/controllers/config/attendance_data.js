/**
 * Created by Administrator on 2017/12/19 0019.
 */
app.controller('AttendDataCtrl', attdatCtrl);

function attdatCtrl($scope, $resource, $timeout,$rootScope, $modal, Config, ConfigService, $state, $http) {
    $scope.attdata = {};
    /*$scope.orgs={};
    $scope.orgs.group=[];*/

   /* //显示当前清除时间
    $http({
        url: '/ma/config/cleanNow',
        method: 'GET'
    }).then(function (result) {
        console.log(result);
        $scope.CleanData = result.data.data;
        /!*alert(result.data.data[0].orgName);*!/
    }, function (reason) {

    });*/
//根据部门查找姓名(已注册过的)
    $scope.checkName=  function(){
        $http({
            url: '/ma/config/checkName1',
            method: 'POST',
            data:$scope.orgsId
        }).then(function (result) {
            $scope.namelist = result.data.data;
        }, function (reason) {
           console.log("人员列表查询失败");
        });
       }
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    $scope.submit2=function(){
        console.log($scope.CleanData);
        if($scope.CleanData===undefined ||$scope.CleanData===null){
            alert("请选择年份");
        }else{
        $http({
            url:"/ma/config/clean",
            method:"POST",
            data:$scope.CleanData
        }).then(function success(response){
            if(response.data.code==='success'){
                alert("数据已清除！");
            }
        },function error(){
            alert("错误");
        })
        }
    };
    //数据备份
    $scope.dataSave=function () {
        if ($scope.orgsId === undefined) {
            alert("请选择组");
        } else if ($scope.StartDate === undefined) {
            alert("请选择开始时间");
        } else if ($scope.EndDate === undefined) {
            alert("请选择结束时间");
        } else if ($scope.StartDate > $scope.EndDate) {
            alert("开始时间不能大于结束时间");
        } else {
            if ($scope.Name === undefined) {
                $scope.Name = "99999";
            }
            $scope.attdata.group = $scope.orgsId;
            $scope.attdata.startDate = $scope.StartDate;
            $scope.attdata.endDate = $scope.EndDate;
            $scope.attdata.person = $scope.Name;
            $http({
                url: "/ma/config/downloadData",
                method: "POST",
                data: $scope.attdata,
                responseType: 'arraybuffer'
            }).then(function successCallback(data) {
                    var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});
                    var objectUrl = URL.createObjectURL(blob);
                    console.log(objectUrl);
                    var aForExcel = $("<a download='布控记录.xls'><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                    $timeout(function () {
                        $("body").append(aForExcel);
                        $(".forExcel").click();
                        aForExcel.remove();
                    });
                }
                , function errorCallback() {
                    alert("无法导出，数据错误或者无记录！");
                });
        }
};};
app .directive('ngTimeE', function() {
    return {
        restrict : 'A',
        require : '?ngModel',
        link : function($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            $('.form_date').datetimepicker({
                language:  'fr',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
            $('.form_date_month').datetimepicker({
                language:  'fr',
                weekStart: 1,
                //todayBtn:  1,
                autoclose: 1,
                //todayHighlight: 1,
                startView: 4,
                minView: 4,
                forceParse: 0
            });
        },
    };
});





