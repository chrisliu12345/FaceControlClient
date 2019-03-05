var saveUri = "/ma/face/";
app.factory("FaceVideo", function ($resource) {
    return $resource(saveUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("FaceVideoService", function () {
    var service = {};
    var org;
    service.get = function () {
        return org;
    };
    service.set = function (newOrg) {
        org = newOrg;
    };
    return service;
});
var queryRealUri = "/ma/query/";
app.factory("QueryReal", function ($resource) {
    return $resource(queryRealUri + ":id", {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
});

app.factory("QueryRealService", function () {
    var service = {};
    var queryReal;
    service.get = function () {
        return queryReal;
    };
    service.set = function (newOrg) {
        queryReal = newOrg;
    };
    return service;
});
app.controller('VideoCtrl', fdCtrl);

function fdCtrl($scope, $rootScope, $http, $modal, $state, $interval, QueryRealService, QueryReal, FaceVideoService, $compile, DTOptionsBuilder, DTColumnBuilder) {

    var vm = this;
    $scope.video = {};
    $scope.video.orgs = [];
    $scope.selectedUser = [];
    $scope.selectedCollectId = [];
    var playersmap = {};
    window.players = playersmap;
    var vid = document.getElementById("video1");

    function createXMLHttpRequest()
    {
        if(window.XMLHttpRequest){
            xmlrequest=new XMLHttpRequest();
        }
        else if (window.ActiveXObject){
            try{
                xmlrequest=new ActiveXObject("Msxml2.XMLHTTP");
            }catch (e){
                try {
                    xmlrequest=new ActiveXObject("Microsoft.XMLHTTP")
                }
                catch(e){

                }
            }
        }
    }
    function change(urls)
    {
        createXMLHttpRequest();
        var url=urls;
        xmlrequest.onreadystatechange=processReponse;
        xmlrequest.open("GET",url,true);
        xmlrequest.send(null);
    }
    function processReponse()
    {
        if(xmlrequest.readyState===4){
            if(xmlrequest.status===200){
                console.log("发送到CS端消息成功!");
            }
            else{
                console.log("消息发送失败！");
            }
        }
    }
    //获取当前显示摄像机列表
    $http({
        url: '/ma/query/camera',
        method: 'GET'
    }).then(function (result) {
        $scope.cameras = result.data.data;
        $http({
            url: '/ma/config/getCameraNow',
            method: 'GET'
        }).then(function (result) {
            $scope.camera = result.data.data;
            $scope.camera1=$scope.camera.CamerId;
            $http({
                url: '/ma/query/videoCamera',
                method: 'POST',
                data: $scope.camera.CamerId
            }).then(function (result) {
                $scope.result = result.data.data;
                if ($scope.result === '0000') {
                    alert("无查询结果");
                }
                $scope.dtDataset = $scope.result;
            }, function (reason) {

            });
        }, function (reason) {
        });

    }, function (reason) {

    });
    //更换摄像机显示地点
    this.submit4 = function () {
        //更换摄像机显示
        vm.selectCamera1();
        //更新列表展示
        update_data();
      /*  $http({
            url: '/ma/config/addCamera1',
            method: 'POST',
            data: $scope.camera1
        }).then(function (result) {
            console.log("更换摄像机显示地点");
            $scope.selectCamandSer = result.data.data1;

             //给CS端发送消息
            // change('http://'+$scope.selectCamandSer+':2341?UpdateShowVideo=1&CameraID=' + $scope.camera1);

        });*/
    };
    //获取当前摄像机的ID，初始化显示摄像机
    $http({
        url: '/ma/video/ConfigCamID',
        method: 'GET',
    }).then(function (result) {
        $scope.CameraIdNow = result.data.data;
       //tbl_camera的CameraID
        vm.selectCameraNow();
    }, function (reason) {
        console.log(reason);
    });
    vm.selectCameraNow=function(){
        $http({
            url: '/ma/video/searchCameraUrl',
            method: 'POST',
            data: $scope.CameraIdNow
        }).then(function (result) {
            $scope.tempUrl = result.data.data;

            $scope.CameraUrl = "http://" + $scope.tempUrl + ":8000/RealVideo/W3C_MSE?cameraid="+$scope.CameraIdNow;
            /* $scope.CameraUrl="http://192.168.6.92:8000/RealVideo/W3C_MSE?cameraid=61789";*/
            console.log($scope.CameraUrl);
            var xmlhttp;
            if (window.XMLHttpRequest){
                xmlhttp=new XMLHttpRequest();}
            else{
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState===4 && xmlhttp.status===200){
                    // 第四步：使用获取的handle加载视频
                    vm.vis_load('http://'+$scope.tempUrl+':8000/ACK/W3C_MSE?ctrlHandle='+xmlhttp.responseText);
                }else if(Number(xmlhttp.status)>=400){
                    layui.use([ 'layer'], function() {
                        var layers = layui.layer;
                        layers.msg('网络连接错误',{time:3000});
                    });
                }
            }
            xmlhttp.open("GET",$scope.CameraUrl,true);
            xmlhttp.send();
        }, function (reason) {
            console.log(reason);
        });
    }
    //选择摄像头
    vm.selectCamera1 = function () {
        vm.vis_destroy();
        $http({
            url: '/ma/video/ConfigCamID1',
            method: 'POST',
            data:$scope.camera1
        }).then(function (result) {
            $scope.CameraIdNow = result.data.data;
            $http({
                url: '/ma/video/searchCameraUrl',
                method: 'POST',
                data: $scope.CameraIdNow
            }).then(function (result) {
                $scope.tempUrl = result.data.data;
                $scope.CameraUrl = "http://" + $scope.tempUrl + ":8000/RealVideo/W3C_MSE?cameraid="+$scope.CameraIdNow;
                console.log($scope.CameraUrl);
                var xmlhttp1;
                if (window.XMLHttpRequest){
                    xmlhttp1=new XMLHttpRequest();}
                else{
                    xmlhttp1=new ActiveXObject("Microsoft.XMLHTTP");}
                xmlhttp1.onreadystatechange=function(){
                    if (xmlhttp1.readyState===4 && xmlhttp1.status===200){
                        // 第四步：使用获取的handle加载视频
                        vm.vis_load('http://'+$scope.tempUrl+':8000/ACK/W3C_MSE?ctrlHandle='+xmlhttp1.responseText);
                    }else if(Number(xmlhttp1.status)>=400){
                        layui.use([ 'layer'], function() {
                            var layers = layui.layer;
                            layers.msg('网络连接错误',{time:3000});
                        });
                    }
                }
                xmlhttp1.open("GET",$scope.CameraUrl,true);
                xmlhttp1.send();
            }, function (reason) {
                console.log(reason);
            });
        }, function (reason) {
            console.log(reason);
        });

    }
    //切换到其他页面时关闭视频播放
    $scope.$on('$destroy', function () {
        vm.vis_destroy();
    });
    //播放视频
    vm.vis_load = function (url) {
        var urlinput = $("#realTimeSearchInput").val();
        console.log('isSupported: ' + visjs.isSupported());
        var element = document.getElementById("video1");
        var mediaDataSource =
            {
                "type": "ps",  // now support ps, rtp, flv
                "isLive": "true",
                "duration": "0",
                "filesize": "0",
                "cors": "true",
                "url": url,  // change this url to switch different camera
                "withCredentials": "false"
            };
        if (typeof playersmap[vid] !== "undefined") {
            if (playersmap[vid] != null) {
                playersmap[vid].unload();
                playersmap[vid].detachMediaElement();
                playersmap[vid].destroy();
                playersmap[vid] = null;
            }
        }
        playersmap[vid] = visjs.createPlayer(mediaDataSource, {
            enableWorker: false,
            lazyLoadMaxDuration: 3 * 60,
            seekType: 'range',
            enableStashBuffer: false
        });
        playersmap[vid].attachMediaElement(element);
        playersmap[vid].load();
    }
    vm.vis_start = function () {
        playersmap[vid].play();
    }

    vm.vis_pause = function () {
        playersmap[vid].pause();
    }

    vm.vis_destroy = function () {
        if (playersmap[vid] == null)
            return;
        playersmap[vid].pause();
        playersmap[vid].unload();
        playersmap[vid].detachMediaElement();
        playersmap[vid].destroy();
        playersmap[vid] = null;
    }

    vm.vis_seekto = function () {
        var input = document.getElementsByName('seekpoint')[0];
        playersmap[vid].currentTime = parseFloat(input.value);
    }

    vm.getUrlParam = function (key, defaultValue) {
        var pageUrl = window.location.search.substring(1);
        var pairs = pageUrl.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var keyAndValue = pairs[i].split('=');
            if (keyAndValue[0] === key) {
                return keyAndValue[1];
            }
        }
        return defaultValue;
    }

    vm.cameras = [];
    $scope.dtDataset = [];


    /**
     * datatable相关变量
     */
        //datatable的api实例变量
    var myTable;
    $scope.myTable = false;
    //手动调用angular数据检查$apply的开关
    $scope.manual$applyTag = false;

    //datatable当前页数据（用户）的临时数
    var tempCurrentPageUser = [];
    //datatable当前页数据（用户）的数组
    var currentPageUser = [];

    /* datatable相关变量 */

    var update_data = function () {
        $http({
            url: '/ma/query/videoCamera',
            method: 'POST',
            data: $scope.camera1
        }).then(function (result) {
            $scope.result = result.data.data;
            if ($scope.result === '0000') {
                alert("无查询结果");
            }
            $scope.dtDataset = $scope.result;
        }, function (reason) {

        });
    };
   //定时刷新图像列表
   var timeConfig = $interval(function () {
        update_data()
    }, 10000, -1);
    //关闭页面销毁定时刷新功能
    $scope.$on('$destroy', function () {
        $interval.cancel(timeConfig);
    });

    //点击人脸图片放大
    $scope.bigPeopic = function (x) {
        var viewer1 = new Viewer(document.getElementById(x),{
            url: 'data-original'
        });

    };
    $scope.bigAllpic = function (x) {
        var viewer2 = new Viewer(document.getElementById(x));
    };

    /**
     * datatable参数设置
     */
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOrder([[2, 'desc']])
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                console.log("header call back");
                $scope.headerCompiled = true;
                $compile(header)($scope);
            }
        })
        .withOption('fnDrawCallback', function (oSettings) {
            currentPageUser = tempCurrentPageUser;
            tempCurrentPageUser = [];
            if ($scope.manual$applyTag) {
                /!*$scope.$apply();*!/
            }
        })
        .withOption('initComplete', function (settings, json) {
            $scope.manual$applyTag = true;
            $scope.myTable = true;
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(row)($scope);
        })
        .withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            tempCurrentPageUser.push(aData);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null)
            .withTitle('识别图像')
            .notSortable()
            .withClass("text-center")
            .renderWith(function (data, type) {
                // var index1 = $scope.dtDataset.indexOf(data);
                var ids = [];
                $scope.dtDataset.forEach(function (item) {
                    ids.push(item.id);
                })
                var index1 = ids.indexOf(data.id);
                var tt = data.id + "1";
                var st=data.id+"2";
                if (-1 !== index1) {
                    var PeopleFace = $scope.dtDataset[index1].url + $scope.dtDataset[index1].DetectetFaceImage;
                    var AllPicture = $scope.dtDataset[index1].url + $scope.dtDataset[index1].CurrFrame;
                    return '<a href="javaScript:void(0)" ng-click="bigPeopic(' + tt + ')"> <img ng-src="' + PeopleFace + '" data-original="'+AllPicture+'" style="width:50px; height:50px;" id="' + tt + '"></a>';
                }
            }),
        DTColumnBuilder.newColumn('inout')
            .withTitle('摄像机名称'),
        DTColumnBuilder.newColumn('datetmp')
            .withTitle('时间'),
        DTColumnBuilder.newColumn('orgadd')
            .withTitle('组'),
      /*  DTColumnBuilder.newColumn('EmployeeId')
            .withTitle('工号'),*/
        DTColumnBuilder.newColumn('realName')
            .withTitle('姓名')
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

