/**
 * Created by Administrator on 2018/1/2 0002.
 */
/**
 * Created by Administrator on 2017/12/21 0021.
 */
app.controller('bigAllPicCtrl', function ($scope, $resource, $http, $state, $modalInstance,QueryService) {
    var vm=this;
    $scope.a1=QueryService.get();
    $scope.srcpath1=$scope.a1.CurrFrame;
    //alert($scope.aas.DetectetFaceImage);
    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});