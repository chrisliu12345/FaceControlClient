imApp.controller('ContractListCtrl', function ($scope, webservice) {
    var self = this;
    this.chatroomReady = false;
    this.friendReady = false;
    this.groupReady = false;
    $scope.tree_data = [];
    $scope.my_tree = tree = {};
    $scope.newGroupName = "";
    $scope.menuState={
        show:true
    };
    console.log($scope.menuState);
    $scope.expanding_property = {
        field: "Name",
        displayName: "人员列表",
        cellTemplate: "<i>{{row.branch[expandingProperty.field]}}</i>"
    };
    $scope.col_defs = [
        {
            field: "displayName",
            sortable: true,
            sortingType: "string"
        }
    ];
    $scope.my_tree_handler = function (branch) {
        if (branch.personType == 'app') {
            $scope.enterChat(branch);
        }
    };

    $scope.my_tree_handler_addMem = function (branch, roomId, type) {
        if (type == 'groupchat') {
            console.log(type);
            if (branch.personType == 'app') {
                console.log(branch.communicationId);
                console.log(typeof(branch.communicationId));
                console.log(roomId);
                if (typeof(branch.communicationId) != "undefined") {
                    webservice.addGroupMembers(branch.communicationId, roomId);
                }
            }
        }
        if (type == 'chat') {
            if (branch.personType == 'app') {
                // console.log(type);
                // console.log($scope.newGroupName);
                if (typeof(branch.communicationId) != "undefined") {
                    // alert(typeof(branch.communicationId));
                    // alert("undef");
                    webservice.createGroup($scope.newGroupName, branch.communicationId);
                }
            }
        }
    };

    this.doCheckPresence = function () {
        if (this.chatroomReady && this.friendReady && this.groupReady) {
            webservice.presence();
        }
    };

    $scope.$on('Selected', function (event, data) {

        console.log(data);

        var currentName = data.current;
        var gList = data.gList;

        gList.forEach(function (item) {
            $('#'+item.name).css("background-color", "white")
        });
        $('#'+ currentName).css("background-color","#f3f6f6");

        // console.log($('.webim-contact-item')[0].innerHTML);
        //
        //
        // $('#'+data).css("background-color","#f3f6f6");
        // console.log($('#hhh').attr("background-color"));
        // // $('#hhh').setClass("selected",true);
        // // background-color: #f3f6f6;
        // $scope.choo = true;
    });

    $scope.$on(WEB_EVENT_LOGINED, function (event, data) {
        webservice.getChatroomList(function (rooms) {
            $scope.chatroomList = rooms.data;
            $scope.chatroomList.forEach(function (room) {
                room.avatar = 'sysim/images/group_user.png';
                room.type == CHAT_TYPE_ROOM;
            })
            $scope.$apply();
            self.chatroomReady = true;
            self.doCheckPresence();
        }, function () {
        });
        webservice.getFriendList(function (friends) {
            $scope.tree_data = friends;
            function editTreedata(item) {
                if (item.type == 'org') {
                    item.displayName = item.orgName;
                } else if (item.type == 'user') {
                    item.displayName = item.realName;
                } else if (item.type == 'app') {
                    item.displayName = item.NAME;
                } else {
                    item.displayName = '';
                }
                item.personType = item.type;
                item.type = CHAT_TYPE_SINGLE;
                if (item.communicationId != undefined) {
                    item.name = item.communicationId;
                }
                item.to = item.communicationId;
                if (item.children && item.children.length && item.children.length > 0) {
                    for (var i = 0; i < item.children.length; i++) {
                        editTreedata(item.children[i]);
                    }
                }
            }

            $scope.tree_data.forEach(function (item) {
                editTreedata(item);
            })
//          console.log($scope.tree_data);
//          $scope.friendList = friends;
//          $scope.friendList.forEach(function(friend){
//              friend.avatar = 'images/default.png';
//              friend.type = CHAT_TYPE_SINGLE;
//          })
            console.log($scope.tree_data);
            $scope.friendList = $scope.tree_data;
            $scope.$apply();
            self.friendReady = true;
            self.doCheckPresence();
        }, function () {
        });
        webservice.getGroupList(function (list) {
            $scope.groupList = list;
            $scope.groupList.forEach(function (group) {
                group.avatar = 'sysim/images/group_user.png';
                group.type = CHAT_TYPE_GROUP;
            })


            // if (group.msglist)
            // {
            //
            // for (var i = 0; i < data.data.length; i++) {
            //     if (data.data[i].type === "txt") {
            //         $scope.emojiHtml += data.data[i].data;
            //     } else if (data.data[i].type === "emoji")
            //         $scope.emojiHtml += '<img src="' + data.data[i].data + '">'
            // }
            // chat.msglist.push(data);
            // group.msglist[group.msglist.length-1].data}

            // console.log($scope.groupList[0].msglist);
            // console.log($scope.groupList[0].msglist.length);


            $scope.$apply();
            self.groupReady = true;
            self.doCheckPresence();
        }, function () {
        });
    })
});