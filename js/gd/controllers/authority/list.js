'use strict';
var authorityUri = "/ma/authority/";
app.factory("Authority", function ($resource) {
    return $resource(authorityUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("AuthorityService", function () {
    var service = {};
    var authority;
    service.get = function () {
        return authority;
    };
    service.set = function (newAuthority) {
        authority = newAuthority;
    };
    return service;
});
app.controller('authorityCtrl', authorityCtrl);

function authorityCtrl($scope,$rootScope, $resource, $modal, Authority, AuthorityService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;

    Authority.get(function (data) {
      //  console.log(data.data[0].authorities.authorityName);
        vm.authorities = data.data;


        //getDatatableAPI(vm.authorities);
        $scope.dtDataset = vm.authorities;
    });

    vm.remove = function (index) {
        AuthorityService.set(vm.authorities[index]);
         var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/delete.html',
            controller: 'DeleteAuthorityCtrl',
             size:'sm'

        });
    };


    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/add.html',
            controller: 'AddAuthorityCtrl',
            controllerAs: 'addVm',
            backdrop: "static",

        });
    };

    vm.view = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.authorities[index].createTime);
        var authority = vm.authorities[index];
        console.log(authority);
        AuthorityService.set(authority);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/view.html',
            controller: 'ViewAuthorityCtrl',
            controllerAs: 'viewVm',
            backdrop: "static",

        });
    };
    vm.edit = function (index) {
        console.log("edit:" + index);
        var authority = vm.authorities[index];
        console.log(authority);
        AuthorityService.set(authority);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/authority/edit.html',
            controller: 'EditAuthorityCtrl',
            controllerAs: 'editVm',
            backdrop: "static",

        });
    };
    vm.toggleAnimation = function () {
        vm.animationsEnabled = !vm.animationsEnabled;
    };

    /**
     * datatable参数设置
     */
    $scope.dtDataset = [];
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;
    $scope.headerCompiled = false;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(row)($scope);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('authorityName')
            .withTitle('权限名称'),
      DTColumnBuilder.newColumn('ak')
            .withTitle('权限详情'),

        DTColumnBuilder.newColumn('updateTime')
            .withTitle('更新时间'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function(data, type, full, meta){
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view('+index+')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看权限"></i></a>' +
                   '<a type="button" ng-click="showCase.edit('+index+')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑权限"></i></a>' +
                    '<a type="button" ng-click="showCase.remove('+index+')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除权限"></i></a>';
            })
    ];




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
