/**
 * Created by Administrator on 2017/6/8.
 */
app.controller('DeleteAccountCtrl', function ($scope, $modalInstance, $state, AccountService, Account) {

    $scope.currentAccount = AccountService.get();

    var accountId = $scope.currentAccount.id;

    $scope.submit = function () {

        Account.delete({}, {id: accountId }, function () {
            $state.go('app.account', {}, {reload: true});
            $modalInstance.close();
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


