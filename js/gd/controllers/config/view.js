
app.controller('ViewConfigCtrl', function ($http,$scope, $resource, $modalInstance) {

    $http({
        url:"/ma/config",
        method:"GET",

    }).then(function success(response){
        $scope.configs=response.data.data;
        $scope.views={};
        for(var i=0;i<$scope.configs.length;i++){
            if($scope.configs[i].name==='WorkingDays'){
                $scope.views.WorkingDays=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='NationalHolidays'){
                $scope.views.NationalHolidays=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='ClockIn'){
                $scope.views.ClockIn=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='ClockOff'){
                $scope.views.ClockOff=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='LunchTimeBegin'){
                $scope.views.LunchTimeBegin=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='LunchTimeEnd'){
                $scope.views.LunchTimeEnd=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='ClockInExtraTime'){
                $scope.views.ClockInExtraTime=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='ClockOffExtraTime'){
                $scope.views.ClockOffExtraTime=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='OffDutyTime'){
                $scope.views.OffDutyTime=$scope.configs[i].value;
            }
            if($scope.configs[i].name==='OvertimeBegin'){
                $scope.views.OvertimeBegin=$scope.configs[i].value;
            }
        }
    },function error(){
        alert("错误");
    })
    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});