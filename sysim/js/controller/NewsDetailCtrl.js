/**
 * 警情详情
 */
imApp.controller('NewsDetailCtrl', function ($scope, $rootScope, InfoService) {
    $scope.currentNew;
    //显示警情详情
    $scope.showNewDetail = function (item) {
        $scope.currentNew = item;
    };

    //发送警情
    $scope.sendNewMessage = function () {
        var info = {};
        info.time = $scope.currentNew.time;
        info.title = $scope.currentNew.title;
        info.position = $scope.currentNew.position;
        info.level = $scope.currentNew.level;
        info.description = $scope.currentNew.description;
        InfoService.set(info);
        $scope.inputMessage2 = '##警情详情## \n ' +
            '接报时间 :' + $scope.currentNew.time +'\n' +
            '事件标题: ' + $scope.currentNew.title + ' \n ' +
            '事件地点: ' + $scope.currentNew.position + ' \n ' +
            '事件等级: ' + $scope.currentNew.level + ' \n ' +
            '事件描述: ' + $scope.currentNew.description;

        $rootScope.$broadcast(WEB_EVENT_SEND_JQ, $scope.inputMessage2);
    }
});