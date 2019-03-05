'use strict'

app.controller('EditAuthorityCtrl', function ($scope, $resource,$http,$state, $modalInstance, Authority, AuthorityService) {



    $scope.edit = function () {

        $scope.authority = AuthorityService.get();
    }
    $scope.edit();
    this.submit = function () {
        // console.log($scope.user.realName);
        // console.log($scope.user.org);

        $scope.authority.selected= $scope.selected;

        $http({
            url:"/ma/authority/update",
            method:"POST",
            data:$scope.authority
        }).then(function success(response){
            $state.go('app.authority', {}, {reload: true});
            $modalInstance.close();
        },function error(){
            console.log("error");
        })
    };


    this.ok = function () {
        $modalInstance.close();
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $http({
        url:"/ma/authority/queryAll",
        method:"GET",
    }).success(function(data){
        console.log(data.data);
        $scope.test12=data.data;
    }).error(function(){

    });

    $scope.selected=[];
    $scope.selectedNames=[];

    var updatedSelected=function(action,id,name){
        if(action=='add'&& $scope.selected.indexOf(id)==-1){
            $scope.selected.push(id);
            $scope.selectedNames.push(name);
        }
        if(action=='remove'&& $scope.selected.indexOf(id)!=-1){
            var id=$scope.selected.indexOf(id);
            $scope.selected.splice(id,1);
            $scope.selectedNames.splice(id,1);
        }

    }
    $scope.updateedSelect=function($event,id){

        var checkbox=$event.target;
        var action =(checkbox.checked? 'add':'remove');
        updatedSelected(action,id,checkbox.name);
    }

});