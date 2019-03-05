
    // 'app', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngTouch', 'ngStorage', 'ui.bootstrap',
    // 'ui.load', 'ui.jq', 'ui.validate', 'oc.lazyLoad', 'pascalprecht.translate', 'ncy-angular-breadcrumb', 'datatable']);
imApp.value("loginConfig", {
    autoLogin: true
});

//登录状态
const LOGIN_STATUS_DEACTIVE = -1;//未登录
const LOGIN_STATUS_ACTIVE = 1;//已登录

//聊天类型
const CHAT_TYPE_SINGLE = 'chat';//单聊
const CHAT_TYPE_GROUP = 'groupchat';//群组
const CHAT_TYPE_ROOM = 'chatroom';//聊天室

imApp.controller('IndexCtrl', function ($scope, $rootScope, $cookieStore, user, loginConfig, $state) {

    // 默认进主页的时候就进行登录
    if (loginConfig.autoLogin) {

        // $scope.login_name = 'test2';
        // $scope.login_password = '111111';
        $rootScope.account = $cookieStore.get('account');

        $scope.login_name = $rootScope.account.accountName;
        $scope.login_password = $rootScope.account.password;


        $scope.currentUserName = $scope.login_name;
        user.login($scope.login_name, $scope.login_password);
    }

    $scope.user = user;
    $scope.logout = function () {
        user.logout();
        // $state.go('app.user', {});
        // 退出时关闭窗口
        window.close();
    };

    $scope.$on(WEB_EVENT_LOGINED, function (event, data) {
        $scope.$apply();
    })
    $scope.$on(WEB_EVENT_LOGOUTED, function (event, data) {

    })
});

imApp.directive('newsList', function () {
    return {
        templateUrl: 'sysim/view/newslist.html',
        controller: 'NewsListCtrl',
        replace: true
    }
});
imApp.directive('newsDetail', function () {
    return {
        templateUrl: 'sysim/view/newsdetail.html',
        controller: 'NewsDetailCtrl',
        replace: true
    }
});
imApp.directive('contractList', function () {
    return {
        templateUrl: 'sysim/view/contractlist.html',
        controller: 'ContractListCtrl',
        replace: true
    }
});
imApp.directive('imPanel', function () {
    return {
        templateUrl: 'sysim/view/impanel.html',
        controller: 'ImPanelCtrl',
        replace: true
    }
});
imApp.directive('login', function () {
    return {
        templateUrl: 'sysim/view/login.html',
        controller: 'LoginCtrl',
        replace: true
    }
});
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}