

// 批量编辑对应的controlller
app.controller('batchExitCtrl', function ($scope,$rootScope, $http,$state, $modalInstance ) {
    $scope.tmp={};
    $scope.tmp.orgs=[];
    $http({
        url: '/ma/orgtree/group',
        method: 'GET'
    }).then(function (result) {
        $scope.groups2 = result.data.data;
        /*alert(result.data.data[0].orgName);*/
    }, function (reason) {

    });
    $scope.submit = function () {
        for(var i=0;i<$rootScope.uuUserid.length;i++){
            $rootScope.uuUserid[i].org=$scope.tmp.orgs[0].orgName;
            $rootScope.uuUserid[i].parentorg=$scope.tmp.orgs[0].parentName;
            $rootScope.uuUserid[i].orgId=$scope.tmp.orgs[0].id;
        }

       $http({
            method:"POST",
            url:"/ma/user/edits",

            data: $rootScope.uuUserid

        }).success(function(response){
          //  $state.go('app.user', {}, {reload: true});
            $modalInstance.close();
        }).error(function(data){
            console.log("error"+data);
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});



