/**
 * 警情列表
 */
imApp.controller('NewsListCtrl', function($scope, news){
    $scope.newsList = news.getList();

});