/**
 * Created by Administrator on 2018/4/16 0016.
 */
app.controller('VoiceCtrl', function ($scope, $modalInstance, $state,$http,VoiceService) {

    $scope.voiceData = VoiceService.get();

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});