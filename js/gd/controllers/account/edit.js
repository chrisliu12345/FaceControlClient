'use strict';

app.controller('EditAccountCtrl', function ($scope, $rootScope, $resource, $http, $state, $modalInstance,
                                         Account, AccountService) {

    // 从list界面获取account信息
    $scope.account = AccountService.get();
   this.submit = function () {
        $scope.accountForPassword={};
        $scope.accountForPassword.id=$scope.account.id;
        $scope.accountForPassword.password=$scope.NewPassword;
        $scope.accountForPassword.oldpassword=$scope.OldPassword;
        $http.post('/ma/account/updatePassword', $scope.accountForPassword).success(function (data) {
            console.log(data.data);
            if(data.data==='errorPassword'){
                alert('旧密码输入错误！请重新输入');
            }else{
                    $state.go('app.account', {}, {reload: true});
                    alert('恭喜，账户信息修改成功！');
                    $modalInstance.dismiss('cancel');
            }
                });

    };


    this.ok = function () {
        $modalInstance.close();
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});