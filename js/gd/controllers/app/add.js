'use strict'

app.controller('AddAppCtrl', function ($rootScope,$scope,$http, $resource, $modalInstance, $state, App) {

    this.submit = function () {
        App.save({}, $scope.app,function () {
            $modalInstance.dismiss('cancel');
            $state.go('app.encoder',{},{reload:true});
        });
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    /*$http({
        method:'GET',
        url:'/ma/encoder/select_code'

    }).then(function successCallback(response){
        $scope.arraylist=new Array();
        for(var i=0;i<response.data.data.length;i++){
            $scope.arraylist.push(response.data.data[i].names);
        }
        $rootScope.names=$scope.arraylist;
       // alert(response.data.data[0].names);
    },function errorCallback(response) {
        alert("error");
    });
*/

});