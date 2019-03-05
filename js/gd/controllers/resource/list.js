'use strict';
var resourceUri = "/ma/resource/";
app.factory("Resource", function ($resource) {
    return $resource(resourceUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});
app.factory("ResourceService", function () {
    var service = {};
    var resource;
    service.get = function () {
        return resource;
    }
    service.set = function (newResource) {
        resource = newResource;
    }
    return service;
})
app.controller('resourceCtrl', resourceCtrl);

function resourceCtrl($scope, $resource, $modal, Resource, ResourceService, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    
    Resource.get(function (data) {
      //  console.log(data.data[0].authorities.authorityName);
        vm.resources = data.data;
        console.log(vm.resources[0].authorities);
        for (var i=0; i<vm.resources.length; i++){
            var arr = new Array();
            arr = vm.resources[i].authorities;
            var authorityNames = '';
            for (var j=0; j<arr.length; j++){

                if (j = arr.length-1){
                    authorityNames = authorityNames + arr[j].authorityName;
                }else {
                    authorityNames = authorityNames + arr[j].authorityName;
                }            }
            vm.resources[i].authorityNames = authorityNames;
        }
        //getDatatableAPI(vm.resources);
        $scope.dtDataset = vm.resources;
    });

    vm.remove = function (index) {
        ResourceService.set(vm.resources[index]);
         var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/resource/delete.html',
            controller: 'DeleteResourceCtrl',
             size:'sm'

        });
    };

    vm.add = function () {
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/resource/add.html',
            controller: 'AddResourceCtrl',
            controllerAs: 'addVm',
            backdrop: "static",

        });
    };

    vm.view = function (index) {
        console.log("view:" + index);
        console.log("view:" + vm.resources[index].createTime);
        var resource = vm.resources[index];
        console.log(resource);
        ResourceService.set(resource);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/resource/view.html',
            controller: 'ViewResourceCtrl',
            controllerAs: 'viewVm',
            backdrop: "static",

        });
    };
    vm.edit = function (index) {
        console.log("edit:" + index);
        var resource = vm.resources[index];
        console.log(resource);
        ResourceService.set(resource);
        var modalInstance = $modal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'tpl/gd/resource/edit.html',
            controller: 'EditResourceCtrl',
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
        DTColumnBuilder.newColumn('resourceName')
            .withTitle('资源名称'),
        DTColumnBuilder.newColumn('description')
            .withTitle('资源详情'),
        DTColumnBuilder.newColumn('authorityNames')
            .withTitle('资源权限'),
        DTColumnBuilder.newColumn('type')
            .withTitle('资源类型'),
        DTColumnBuilder.newColumn('parentName')
            .withTitle('父资源'),
        DTColumnBuilder.newColumn('url')
            .withTitle('资源路径'),
        DTColumnBuilder.newColumn('level')
            .withTitle('资源层级'),
        DTColumnBuilder.newColumn('isMenuLeaf')
            .withTitle('叶子结点'),
        DTColumnBuilder.newColumn(null)
            .withTitle('操作')
            .notSortable()
            .renderWith(function(data, type, full, meta){
                var index = $scope.dtDataset.indexOf(data);
                return '<a type="button" ng-click="showCase.view('+index+')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看资源"></i></a>' +
                    '<a type="button" ng-click="showCase.edit('+index+')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑资源"></i></a>' +
                    '<a type="button" ng-click="showCase.remove('+index+')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除资源"></i></a>';
            })
    ];
    // var getDatatableAPI = function(data){
    //         $scope.selectedResource = [];
    //         manual$applyTag = false;
    //         myTable = $('#resourceList').DataTable( {
    //             destroy: true,
    //             data: data,
    //             bDeferRender: true,
    //             order: [[ 1, 'asc' ]],
    //             sPaginationType: "full_numbers",
    //             columns: [
    //                 // {
    //                 //     sClass: "text-center",
    //                 //     bSortable: false,
    //                 //     data: null,
    //                 //     "render": function (data, type, full, meta) {
    //                 //         var index = vm.resources.indexOf(data);
    //                 //         return '<input type="checkbox" ng-checked="isSelectedByIndex('+index+')" ng-click="showCase.updateSelectionOne($event,'+index+')">';},
    //                 // },
    //                 {
    //                     data: 'resourceName', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'description', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'authorityNames', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'type', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'parentName', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'url', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'level', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     data: 'isMenuLeaf', defaultContent: "缺少此项信息"
    //                 },
    //                 {
    //                     sClass: "text-center",
    //                     bSortable: false,
    //                     data: null,
    //                     "render": function (data, type, row) {
    //                         var index = vm.resources.indexOf(data);
    //                         return '<a type="button" ng-click="showCase.view('+index+')" class="btn btn-info btn-xs"><i class="icon-info" tooltip="查看资源"></i></a>' +
    //                             '<a type="button" ng-click="showCase.edit('+index+')" class="btn btn-warning btn-xs"><i class="fa fa-edit" tooltip="编辑资源"></i></a>' +
    //                             '<a type="button" ng-click="showCase.remove('+index+')" class="btn btn-danger btn-xs"> <i class="fa fa-trash-o" tooltip="删除资源"></i></a>';
    //                     }
    //                 }],
    //             "fnDrawCallback": function (oSettings) {
    //                 currentPageResource = tempCurrentPageResource;
    //                 tempCurrentPageResource = [];
    //                 if(manual$applyTag){
    //                     $scope.$apply();
    //                 }
    //             },
    //             //编译全部tr
    //             "createdRow": function( row, data, dataIndex ) {
    //                 $compile(row)($scope);
    //             },
    //             "initComplete": function( settings, json ) {
    //                 manual$applyTag = true;
    //             },
    //             "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    //                 tempCurrentPageResource.push(aData);
    //             }
    //         } );
    //     };
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
