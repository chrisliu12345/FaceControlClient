/**
 * Created by seshi on 2017/5/19.
 */
app.controller('currentAccountUserinfoCtrl', function ($scope, $rootScope, $http, $state) {


    // 根据组织名称返回组织id
    $scope.findOrgIdByOrgName = function (array, orgName) {
        for (var i = 0; i < array.length; i++) {
            if (orgName === array[i].orgName)
                return array[i].id;
        }
    };

    this.submit = function () {
        $scope.user.org = $scope.orgs.selected.orgName;
        $scope.user.orgId = $scope.orgs.selected.id;

        var UPDATE_USER_ORG_URL = '/ma/user';
        $http.put(UPDATE_USER_ORG_URL, $scope.user)
            .then(
                function (response) {
                    // $rootScope.currentAccountUserinfo.userinfo[0] = shadowCopy($scope.user);
                    angular.copy($scope.user, $rootScope.currentAccountUserinfo.userinfo[0]);
                    console.log('修改完毕');
                },
                function () {
                    console.log("错误");
                }
            );
        $state.go('app.dashboard');
    };

    this.cancel = function () {
        $state.go('app.dashboard');
    };




    this.confirmChangePassword = function () {
        $scope.changepwd={};
        $scope.changepwd.oldpassword=$scope.oldPassword;
        $scope.changepwd.id=$rootScope.accountId;
        $scope.changepwd.password=$scope.newPassword;
        $http({
            url:"/ma/account/updatePassword",
            method:"POST",
            data:$scope.changepwd
        }).then(function success(response){
            if(response.data.data==='errorPassword'){
                alert("旧密码不正确，请重新输入");
            }else{
                alert("密码修改成功，请重新登陆！");
                $state.go('app.dashboard');
            }


        },function error(){
            console.log("error");
        })
    }

    this.cancelChangePassword = function () {
        console.log('取消修改密码');
        $state.go('app.dashboard');
    }


});
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