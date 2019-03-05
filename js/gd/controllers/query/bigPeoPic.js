/**
 * Created by Administrator on 2018/1/2 0002.
 */
/**
 * Created by Administrator on 2017/12/21 0021.
 */
app.controller('bigPicCtrl', function ($scope, $resource, $http, $state, $modalInstance,QueryService) {
    var vm=this;
    $scope.a2=QueryService.get();
    $scope.srcpath2=$scope.a2.DetectetFaceImage;
    //alert($scope.aas.DetectetFaceImage);
    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});