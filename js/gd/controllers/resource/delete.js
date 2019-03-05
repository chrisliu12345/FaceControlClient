/**
 * Created by Administrator on 2017/6/8.
 */
app.controller('DeleteResourceCtrl', function ($scope, $modalInstance, $state, ResourceService, Resource) {

    $scope.currentResource = ResourceService.get();

    var resourceId = $scope.currentResource.id;

    $scope.submit = function () {

        Resource.delete({}, {id: resourceId}, function () {

            $state.go('app.resource', {}, {reload: true});
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


