 var ss={};
app.controller('QuAllCtrl', queCtrl);

function queCtrl($scope, $rootScope,$http, $modal ,Query, QueryService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    var flag1="迟到";
    var flag2="早退";
    var flag3="旷工";
    var flag4="加班";
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
    //根据部门查找姓名(已注册过的)
    var checkName=vm.checkName=  function(){

        var slist=$scope.org1.split("|");
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
    vm.queryCamera=function () {
        $scope.AList={};
        if($scope.org1===null || $scope.org1===''|| $scope.org1==undefined){
        }else{
            var slistt=$scope.org1.split("|");
            $scope.AList.orgId=slistt[2];//获取工号
        }
        if($scope.Name===null || $scope.Name===''|| $scope.Name==undefined){
        }else{
            $scope.AList.CollectId=$scope.Name;//获取工号
        }
        if($scope.Start===null || $scope.Start===''|| $scope.Start==undefined){
           $scope.AList.Start="2000-01-01";
        }else{
            $scope.AList.Start=$scope.Start;//开始时间
        }
        if($scope.End===null || $scope.End===''|| $scope.End===undefined){
            $scope.AList.End="3000-01-01"
        }else{
            $scope.AList.End=$scope.End;//结束时间
        }
        if($scope.selectedUser!==null ||$scope.selectedUser!=='') {

            $scope.AList.Flag = $scope.selectedUser;//记录迟到早退旷工加班
        }

        $http({
            url: '/ma/query/Result1',
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
    vm.updateSelectionOne = function ($event, index) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, index);
    };
    //实际更新被选中用户的数组的方法

    var updateSelected = function (action, user) {
        if (action === 'add' && $scope.selectedUser.indexOf(user) === -1) {
            $scope.selectedUser.push(user);
        }
        if (action === 'remove' && $scope.selectedUser.indexOf(user) !== -1) {
            var idx = $scope.selectedUser.indexOf(user);
            $scope.selectedUser.splice(idx, 1);
        }


    };
    
    //实现导出记录
    vm.export_records=function () {
        $http({
            method: "POST",
            url: "ma/queryExport/attend_export",
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
        DTColumnBuilder.newColumn(null)
            .withTitle('姓名')
            .notSortable()
            .withClass("text-center")
            .renderWith(function (data) {
            return '<a href="javaScript:void(0)" ng-click="showTimeLine(' + data.id + ')">'+data.realName+'</a>'
        }),
        DTColumnBuilder.newColumn('ClockInTemp')
            .withTitle('上班时间'),
        DTColumnBuilder.newColumn('ClockOffTemp')
            .withTitle('下班时间'),
        DTColumnBuilder.newColumn('AttendanceFlag')
            .withTitle('打卡标记')
    ];

    //获取选中数据//时间轴参数
    $scope.showTimeLine=function (id) {
        $http({
            url: '/ma/query/recordResult',
            method: 'POST',
            data:id
        }).then(function (result) {
            $scope.ts=result.data.data;
            $scope.ceshiT=(
                $scope.ts
            );
            var options = {
                showCurrentTime:true
            };
            var container = document.getElementById('visualizationNow');
            // Create a Timeline
            $scope.timeline = new vis.Timeline(container,  $scope.ceshiT, options);
        }, function (reason) {

        });
    };
    $scope.ceshiT=([
        {id: 1, content: 'item 1', start: '2018-03-29 22:09:20', end:'2018-03-29 22:59:16'},
    ]);
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
app .directive('ngTimeC', function() {
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
 app .directive('ngTimeLine', function() {
     return {
         restrict : 'A',
         require : '?ngModel',

         link : function($scope, $element, $attrs, $ngModel) {
             //$('.js-timeline').Timeline();
             $scope.items=$scope.ceshiT;
            /* var items =([
                 {id: 1, content: 'item 1', start: '2018-03-29 22:09:20', end:'2018-03-29 22:59:16'},
             ]);*/
             var options = {
                 min:'2018-03-29',
                 max:'2018-03-30'
             };
             var container = document.getElementById('visualization');
             // Create a Timeline
             var timeline = new vis.Timeline(container, $scope.items, options);
         },
     };
 });

