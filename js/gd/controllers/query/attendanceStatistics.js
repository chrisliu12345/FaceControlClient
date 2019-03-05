/**
 * Created by 郄梦岩 on 2017/12/23.
 */
app.controller('AttStCtrl', attstCtrl);

function attstCtrl($scope, $rootScope,$http,  $modal ,Query, QueryService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    $scope.items=[];
    $scope.dtDataset = [];
    $scope.selectedUser=[];
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

    /* datatable相关变量 */

    //获取datatable数据，初始化table
    $http({
        url: '/ma/query/queryAll',
        method: 'GET'
    }).then(function (result) {
        $scope.items =result.data.data;
        //进行数组拆分
        for(var i=0;i<$scope.items.length;i++){
            $scope.items[i].orgs=$scope.items[i].parentorg+"-"+$scope.items[i].org;
        }
        $scope.dtDataset = $scope.items;
    }, function (reason) {

    });

//获取部门
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });


//查询数据结果
    vm.queryOrgs=function () {
        if($scope.org1===null || $scope.org1===''|| $scope.org1===undefined) {
            alert("请选择组！");
            return;
        }
        $scope.AList={};
        var slist=$scope.org1.split("|");
        $scope.AList.parentOrg=slist[0];
        $scope.AList.org=slist[1];
        $scope.AList.orgId=slist[2];
        if($scope.Start===null || $scope.Start===''|| $scope.Start===undefined){
            $scope.AList.Start="2000-01-01";
        }else{
            $scope.AList.Start=$scope.Start;//开始时间
        }
        if($scope.End===null || $scope.End===''|| $scope.End===undefined){
            $scope.AList.End="3000-01-01";
        }else{
            $scope.AList.End=$scope.End;//结束时间
        }
        $http({
            url: '/ma/query/Result2',
            method: 'POST',
            data:$scope.AList
        }).then(function (result) {
            $scope.result = result.data.data;
            if($scope.result==='TimeEquals'){
                alert("开始时间与结束时间不能相等，请重新选择！");
                return;
            }
            if($scope.result==="0000"){
                alert("无查询结果");
                $scope.dtDataset=null;
                return ;
            }else{
                for(var i=0;i<$scope.result.length;i++){
                    $scope.result[i].orgs=$scope.result[i].parentorg+"-"+$scope.result[i].org;
                }
                $scope.dtDataset =$scope.result;
            }
        }, function (reason) {

        });
    }
    //获取当前日期和时间
    var getdatatime=function() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }
    vm.export_records=function () {
        $scope.records={};
        $scope.records.num="2";

        if($scope.org1===null || $scope.org1===''|| $scope.org1===undefined) {
            alert("请选择组！");
            return;
        }else {
            var slist1=$scope.org1.split("|");
            $scope.records.orgId = slist1[2];
        }
        if($scope.Start===null || $scope.Start===''|| $scope.Start===undefined){
            $scope.records.Start="2000-01-01";
        }else{
            $scope.records.Start=$scope.Start;//开始时间
        }
        if($scope.End===null || $scope.End===''|| $scope.End===undefined){
            $scope.records.End="3000-01-01";
        }else{
            $scope.records.End=$scope.End;//结束时间
        }
        $http({
            method: "POST",
            url: "ma/queryExport/attend_export",
            data:$scope.records,
            headers: {
                Authorization: $rootScope.tokens
            },
            responseType: 'arraybuffer'

        }).then(function successCallback(data) {
                var blob = new Blob([data.data], {type: "application/vnd.ms-excel;utf-8"});
                var objectUrl = URL.createObjectURL(blob);
                var aForExcel = $("<a><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
                $("body").append(aForExcel);
                $(".forExcel").click();
                aForExcel.remove();
            }
            , function errorCallback() {
                alert("无法导出，数据错误或者无记录！");
            });
    }

    /**
     * datatable参数设置
     */
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[1, 'desc']])
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
        DTColumnBuilder.newColumn('orgs')
            .withTitle('组'),
        DTColumnBuilder.newColumn('realName')
            .withTitle('姓名'),
        DTColumnBuilder.newColumn('ClockInTemp')
            .withTitle('上班时间'),
        DTColumnBuilder.newColumn('ClockOffTemp')
            .withTitle('下班时间'),
        DTColumnBuilder.newColumn('AttendanceFlag')
            .withTitle('打卡标记')
    ];










}
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
app .directive('ngTime', function() {
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
        },
    };
});

