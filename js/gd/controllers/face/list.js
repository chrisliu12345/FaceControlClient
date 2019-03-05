'use strict';


app.controller('FaceCtrl', fcCtrl);

function fcCtrl($scope) {

}

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
app.directive('ngTime', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function ($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            $('.form_time').datetimepicker({
                language: 'fr',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 1,
                minView: 0,
                maxView: 1,
                forceParse: 0
            });
        },
    };
});
