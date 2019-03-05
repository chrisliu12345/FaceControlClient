'use strict';
var roleUri = "/ma/role/";
app.factory("Role", function ($resource) {
    return $resource(roleUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT',
        }
    });
});
app.factory("RoleService", function () {
    var service = {};
    var role;
    service.get = function () {
        return role;
    };
    service.set = function (newRole) {
        role = newRole;
    };
    return service;
});
app.controller('roleCtrl', roleCtrl);

function roleCtrl($scope, $resource, $modal, Role, RoleService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;

    Role.get(function (data) {
        console.log(data.data);
        vm.roles = data.data;
        //getDatatableAPI(vm.roles);
        $scope.dtDataset = vm.roles;

    });

    vm.remove = function (index) {
        RoleService.set(vm.roles[index]);

        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/role/delete.html',
            controller: 'DeleteRoleCtrl',
            size:'sm'
        });
    };

    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/role/add.html',
            controller: 'AddRoleCtrl',
            controllerAs: 'addVm',
            backdrop: "static"

        });
    };

    vm.view = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.roles[index].createTime);
        var role = vm.roles[index];
        console.log(role);
        RoleService.set(role);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/role/view.html',
            controller: 'ViewRoleCtrl',
            controllerAs: 'viewVm',
            backdrop: "static"

        });
    };
    vm.edit = function (index) {
        console.log("edit:" + index);
        var role = vm.roles[index];
        console.log(role);
        RoleService.set(role);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/role/edit.html',
            controller: 'EditRoleCtrl',
            controllerAs: 'editVm',
            backdrop: "static"

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
        DTColumnBuilder.newColumn('roleName')
            .withTitle('角色名称'),
        DTColumnBuilder.newColumn('description')
            .withTitle('角色详情'),
        DTColumnBuilder.newColumn('authorityNames')
            .withTitle('权限'),
        DTColumnBuilder.newColumn('updateTime')
            .withTitle('更新时间'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function(data, type, full, meta){
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view('+index+')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看角色"></i></a>' +
                    '<a type="button" ng-click="showCase.edit('+index+')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑角色"></i></a>' +
                    '<a type="button" ng-click="showCase.remove('+index+')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除角色"></i></a>';
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
