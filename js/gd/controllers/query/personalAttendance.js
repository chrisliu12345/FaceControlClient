/**
 * Created by 郄梦岩 on 2017/12/23.
 */
app.controller('PerAttCtrl', perattCtrl);

function perattCtrl($scope, $rootScope,$http,  $modal ,Query, QueryService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    $scope.admin=true;
    $scope.person=false;
    $scope.ii=false;
    $scope.items=[];
    $scope.dtDataset = [];
    $scope.selectedUser=[];


    if($rootScope.currentAccountUserinfo.decription==='3'){
        $scope.admin=false;
        $scope.person=true;
        $scope.org11=$rootScope.currentAccountUserinfo.bumen;
        $scope.realName=$rootScope.currentAccountUserinfo.realName;
        $scope.ii=true;

    }else{
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
    }
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


//获取部门
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });

    $scope.checkName=vm.checkName=  function(){

        var slist=$scope.org11.split("|");
        //alert(slist[0]+"///"+slist[1]);
        $scope.all1={};
        $scope.all1.parentOrg=slist[0];
        $scope.all1.org=slist[1];
        $scope.all1.orgId=slist[2];
        $http({
            url: '/ma/video/checkName1',
            method: 'POST',
            data:$scope.all1
        }).then(function (result) {
            $scope.namelist = result.data.data;
        }, function (reason) {

        });
    }

//查询数据结果
    $scope.queryresult=vm.queryPerson=function () {
        $scope.AList={};
        if($scope.realName===undefined){
            alert("请选择人员！");
            return;
        }

        $scope.AList.CollectId=$scope.realName;//获取CollectId
        if($scope.org11===null ||$scope.org11==='' ||$scope.org11===undefined){
        }else{
            var slist=$scope.org11.split("|");//获取部门
            //alert(slist[0]+"///"+slist[1]);
            $scope.AList.parentOrg=slist[0];//上级部门
            $scope.AList.org=slist[1];//本部门
        }
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
            url: '/ma/query/Result3',
            method: 'POST',
            data:$scope.AList
        }).then(function (result) {
            $scope.result = result.data.data;
            if($scope.result==='TimeEquals'){
                alert("开始时间与结束时间不能相等，请重新选择！");
                return;
            }
            if($scope.result=="0000"){
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
    };
    //个人考勤导出记录
    vm.export_records=function () {
        $scope.records={};
        $scope.records.num="3";
        console.log($scope.number);
        console.log($scope.realName);
        if($scope.number===undefined&&$scope.realName===undefined){
            alert("请选择人员或者填写别名！");
            return;
        }
        if($scope.number===null || $scope.number===''|| $scope.number===undefined) {

        }else {
            $scope.records.PoliceNum = $scope.number;
        }
        if($scope.realName===null || $scope.realName===''|| $scope.realName===undefined){
        }else{
            $scope.records.realName=$scope.realName;
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
app .directive('ngTimeB', function() {
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

