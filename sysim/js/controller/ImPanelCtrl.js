imApp.controller('ImPanelCtrl', function ($scope, $rootScope, webservice, $timeout) {
    WebIM.Emoji = {
        path: 'sysim/images/faces/'  /*表情包路径*/
        , map: {
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
        }
    };
    $scope.$on(WEB_EVENT_RECEIVED, function (event, data) {
        if (data.delay) {
            data.time = data.delay;
        } else {
            data.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
        var chat = $scope.findChatContext(data.type, data.to, data.from);
        if (chat) {
            if (!chat.msglist) chat.msglist = [];
            chat.msglist.push(data);
            console.log(data);
            if (chat != $scope.currentChat) {
                chat.hasNew = true;
            }
        }
        $scope.$apply();
        $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
    });
    $scope.$on(WEB_EVENT_RECEIVED_EMOJI, function (event, data) {
        if (data.delay) {
            data.time = data.delay;
        } else {
            data.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
        var chat = $scope.findChatContext(data.type, data.to, data.from);
        var emojiHtml = "";
        if (chat) {
            if (!chat.msglist) chat.msglist = [];

            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].type === "txt") {
                    emojiHtml += data.data[i].data;
                } else if (data.data[i].type === "emoji")
                    emojiHtml += '<img src="' + data.data[i].data + '">'
            }
            // data.data = "";
            if (chat != $scope.currentChat) {
                chat.hasNew = true;
            }

            var showData = data;
            showData.emoji = true;

            chat.msglist.push(showData);
        }
        $scope.$apply();
        // ht.html("sdfdsfsd");
        // var jj = ht.last();
        //     jj.html(emojiHtml);
        // // jj.append(emojiHtml);
        $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
        // 在前台展示页面根据是表情还是文字进行了显示处理，所以暂时将这里注释了
        // $('.webim-msg-data').last().html(emojiHtml);
    });
    $scope.$on(WEB_EVENT_RECEIVED_PICTURE, function (event, data) {
        if (data.delay) {
            data.time = data.delay;
        } else {
            data.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
        var chat = $scope.findChatContext(data.type, data.to, data.from);
        var emojiHtml = "";
        if (chat) {
            if (!chat.msglist) chat.msglist = [];

            // for(var i = 0; i < data.data.length; i++){
            //     if(data.data[i].type === "txt"){
            //         emojiHtml += data.data[i].data;
            //     }else if(data.data[i].type === "emoji")
            //         emojiHtml += '<img src="' + data.data[i].data + '">'
            // }
            // data.data = "";
            emojiHtml += '<img class="webim-msg-img" src="' + data.url + '">'
            if (chat != $scope.currentChat) {
                chat.hasNew = true;
            }
            chat.msglist.push(data);
        }
        $scope.$apply();
        $('.webim-msg-data').last().html(emojiHtml);
        // ht.html("sdfdsfsd");
        // var jj = ht.last();
        //     jj.html(emojiHtml);
        // // jj.append(emojiHtml);
        $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
    });
    $scope.$on(WEB_EVENT_RECEIVED_FILE, function (event, data) {
        if (data.delay) {
            data.time = data.delay;
        } else {
            data.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
        var chat = $scope.findChatContext(data.type, data.to, data.from);
        var emojiHtml = "";
        if (chat) {
            if (!chat.msglist) chat.msglist = [];

            // for(var i = 0; i < data.data.length; i++){
            //     if(data.data[i].type === "txt"){
            //         emojiHtml += data.data[i].data;
            //     }else if(data.data[i].type === "emoji")
            //         emojiHtml += '<img src="' + data.data[i].data + '">'
            // }
            data.data = "";
            // <a target="_blank" href="https://a1.easemob.com/easemob-demo/chatdemoui/chatfiles/21c440b0-5658-11e7-8b86-577e5eab87e8" data-reactid=".c.2.1.1.1.3:$0">点击下载</a>


            // emojiHtml += '<span class="webim-msg-header-icon font small">S</span>';
            // emojiHtml += '<a target="_blank" href="' + data.url + '">' + '下载文件</a>';
            // <div class="webim-msg-val"></div>


            emojiHtml += '<span class="webim-msg-icon font">H</span> <div> <p class="webim-msg-header">文件：' + data.filename + '</p> <div> <span class="webim-msg-header-icon font small">S</span><a target="_blank" href="' + data.url + '">点击下载</a></div></div>';
            // emojiHtml += '<div><a target="_blank" href="sysim/images/logo.png"> + 下载文件</a></div>';
            if (chat != $scope.currentChat) {
                chat.hasNew = true;
            }
            chat.msglist.push(data);
        }
        $scope.$apply();
        $('.webim-msg-value').last().html(emojiHtml);
        // ht.html("sdfdsfsd");
        // var jj = ht.last();
        //     jj.html(emojiHtml);
        // // jj.append(emojiHtml);
        $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
    });

    // received video message
    $scope.$on(WEB_EVENT_RECEIVED_VIDEO, function (event, data) {
        if (data.delay) {
            data.time = data.delay;
        } else {
            data.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
        var chat = $scope.findChatContext(data.type, data.to, data.from);
        if (chat) {
            if (!chat.msglist) chat.msglist = [];

            var showData = data;
            showData.audioData = data.length + '"' + '                                 ';
            // showData.audioData = 'audio :' + data.length;
            showData.url = showData.url.replace('192.168.10.36:80', 'localhost:9091');


            chat.msglist.push(showData);

            if (chat != $scope.currentChat) {
                chat.hasNew = true;
            }
        }
        $scope.$apply();
        $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
    });


    $scope.playVideo = function (msg) {

        var url = msg.url;

        // 每个msg都有是否播放的属性，这样避免多个语音文件同时播放动画
        msg.voicePlay = true;

        $timeout(function () {
            $scope.$apply(function () {
                msg.voicePlay = false;
            });
        }, 1000 * msg.length);



        var videoUrl = '/ssy/ccf/chatfiles/2b92f1f0-7029-11e7-9a06-cb78bc09784d';
        var xhr = new XMLHttpRequest();
        // xhr.open('GET', E('#sample-amr > a').href);
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            playAmrBlob(this.response);
        };
        xhr.send();
    };

    // 下面这几个函数主要是用于播放amr 转换需要的函数
    function readBlob(blob, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            callback(data);
        };
        reader.readAsArrayBuffer(blob);
    }

    function playAmrBlob(blob, callback) {
        readBlob(blob, function (data) {
            playAmrArray(data);
        });
    }

    function convertAudioBlob(blob) {
        readBlob(blob, function (data) {
            var ctx = new AudioContext();
            ctx.decodeAudioData(data.buffer, function (audioBuffer) {
                var pcm = new Float32Array(audioBuffer.length);
                audioBuffer.copyFromChannel(pcm, 0, 0);
                var amr = AMR.encode(pcm, audioBuffer.sampleRate, 7);
                playAmrArray(amr);
            });
        });
    }

    function playAmrArray(array) {
        var samples = AMR.decode(array);
        if (!samples) {
            alert('Failed to decode!');
            return;
        }
        playPcm(samples);
    }

    function playPcm(samples) {
        var ctx = new AudioContext();
        var src = ctx.createBufferSource();
        var buffer = ctx.createBuffer(1, samples.length, 8000);
        buffer.copyToChannel(samples, 0, 0);
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.start();
    }

    // 配置右键信息
    $scope.menuOptions = [
        {
            label: '复制',
            onClick: menuSave
        },
        {
            label: '转发',
            onClick: menuTransfer
        },
        {
            label: '删除',
            onClick: menuDelete
        },
        {
            label: '转文字',
            onClick: menuToText
        }
    ];

    function menuSave($event) {
        console.log($event);
        alert('save');
    }

    function menuTransfer($event) {
        console.log($event);
        alert('transfer');
    }

    function menuDelete($event) {
        console.log($event);
        alert('delete');
    }

    function menuToText($event) {
        console.log($event);

        // $event.dataContext.audioData = "早上好!";
        $event.dataContext.audioData = "早上好!为佛教；奥减肥的；辣椒粉；拉德斯基地方；拉斯基饭店；";


        $event.dataContext.audioText = true;

        console.log('speech to text');

    }


    ////////////////////////////
    var emojiPanel = angular.element("#emojiPanel");
    var editTextarea = angular.element('#editTextarea');

    $scope.$on(WEB_EVENT_SEND_JQ, function (p1, p2) {

        editTextarea.focus();
        var select = window.getSelection();
        var range = select.getRangeAt(0);
        var text = new Text();
        text.textContent = p2;
        range.insertNode(text);
    });
    angular.element(document).click(function (e) {
        if (!emojiPanel.is(':hidden')) {
            emojiPanel.hide(200);
            e.stopPropagation();
        }
    });
    emojiPanel.click(function (e) {
        e.stopPropagation();
    });
    editTextarea.click(function (e) {
        range = select.getRangeAt(0);
        e.stopPropagation();
    });
    $scope.showEmojiPanel = function (e) {
        if (emojiPanel.is(':hidden')) {
            emojiPanel.show(100);
            e.stopPropagation();
        }
    };
    emojiPanel.hide();

    editTextarea.focus();
    var select = window.getSelection();
    var range = select.getRangeAt(0);
    range.collapse(false);
    editTextarea.blur();

    var emojiMap = [];
    $scope.insertEmoji = function (emojiText, imageUrl, e) {
        var img = new Image();
        img.src = imageUrl;
        range.insertNode(img);
        range.collapse(false);

        var emojiMapItem = {};
        emojiMapItem.emojiText = emojiText;
        emojiMapItem.imageUrl = imageUrl;
        emojiMap.push(emojiMapItem);
        e.stopPropagation();
    };
    $scope.editTextareaKeydown = function (e) {
        if (e.keyCode === 13) {
            if (e.ctrlKey) {
                var br = document.createElement("br");
                range.insertNode(br);
                range.collapse(false);
            } else {
                $scope.send();
                e.preventDefault();
            }
        }
    };
    $scope.editTextareaKeyup = function () {
        range = select.getRangeAt(0);
        range.collapse(false);
    };
    $scope.onImageSelect = function () {
        console.log("??????????");
        $scope.sendImage();
    };
    $scope.onFileSelect = function () {
        console.log("??????????");
        $scope.sendFile();
    };
    $scope.send = function () {
        $scope.sendMessage();
        // $scope.sendFile();
        // $scope.sendImage();
    };

    $scope.isString = function (name) {
        return typeof name == 'string';
    };

    $scope.sendFile = function () {
        // if ($scope.currentChat && $scope.inputMessage != '') {
        if ($scope.currentChat) {
            var msg = {
                from: $scope.currentUserName,
                data: $scope.inputMessage,
                time: new Date().Format('yyyy-MM-dd hh.amr:mm:ss')
            }
            if ($scope.currentChat.type == CHAT_TYPE_SINGLE) {
                msg.to = $scope.currentChat.name
            } else if ($scope.currentChat.type == CHAT_TYPE_GROUP) {
                msg.to = $scope.currentChat.roomId
            }
            $scope.inputMessage = '';
            console.log(msg.data);
            webservice.sendFile($scope.currentChat.type, msg.data, msg.to, function (filename, url) {
                if (!$scope.currentChat.msglist) $scope.currentChat.msglist = [];
                $scope.currentChat.msglist.push(msg);
                $scope.$apply();
                var emojiHtml = "";
                emojiHtml += '<span class="webim-msg-icon font">I</span> <div> <p class="webim-msg-header">文件：' + filename + '</p> <div> <span class="webim-msg-header-icon font small">S</span><a target="_blank" href="' + url + '">点击下载</a></div></div>';
                $('.webim-msg-value').last().html(emojiHtml);
                $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
            }, function () {
            });
        } else if (!$scope.currentChat) {
            alert('请选择发送到哪个群组或好友');
        }
    };
    $scope.sendImage = function () {
        // if ($scope.currentChat && $scope.inputMessage != '') {
        if ($scope.currentChat) {
            var msg = {
                from: $scope.currentUserName,
                data: $scope.inputMessage,
                time: new Date().Format('yyyy-MM-dd hh.amr:mm:ss')
            }
            if ($scope.currentChat.type == CHAT_TYPE_SINGLE) {
                msg.to = $scope.currentChat.name
            } else if ($scope.currentChat.type == CHAT_TYPE_GROUP) {
                msg.to = $scope.currentChat.roomId
            }
            $scope.inputMessage = '';
            console.log(msg.data);
            webservice.sendImage($scope.currentChat.type, msg.data, msg.to, function (url) {
                if (!$scope.currentChat.msglist) $scope.currentChat.msglist = [];
                $scope.currentChat.msglist.push(msg);

                $scope.$apply();
                var emojiHtml = "";
                emojiHtml += '<img class="webim-msg-img" src="' + url + '">';
                $('.webim-msg-data').last().html(emojiHtml);
                // document.getElementsByClassName('webim-msg-data').last().innerHTML = emojiHtml;
                // console.log($('.webim-chatwindow-msg')[0].scrollHeight);
                console.log($('.webim-chatwindow-msg')[0].scrollHeight);
                console.log($('.webim-chatwindow-msg')[0].innerHTML);
                // var t1 = $('.webim-chatwindow-msg')[0];
                $('.webim-chatwindow-msg').scrollTop(2000);
                // $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
                // var t2 = $('.webim-chatwindow-msg')[0];
                // console.log($('.webim-chatwindow-msg')[0]);
                // console.log($('.webim-chatwindow-msg')[0].scrollHeight);
                console.log($('.webim-chatwindow-msg')[0].scrollHeight);
                console.log($('.webim-chatwindow-msg')[0].innerHTML);
                // console.log($('.webim-chatwindow-msg').scrollTop());

            }, function () {
            });
        } else if (!$scope.currentChat) {
            alert('请选择发送到哪个群组或好友');
        }
    };
    $scope.findChatContext = function (type, to, from) {
        var ret = null;
        if (type == CHAT_TYPE_SINGLE) {
//          for(var i=0; i<$scope.friendList.length; i++){
//              if($scope.friendList[i].name==from){
//                  ret = $scope.friendList[i];
//                  break;
//              }
//          }
            function getFrientByCName(arr, name) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].name == name) {
                        return arr[i];
                    } else {
                        if (arr[i].children && arr[i].children.length && arr[i].children.length > 0) {
                            return getFrientByCName(arr[i].children, name);
                        }
                    }
                }
                return null;
            }

            ret = getFrientByCName($scope.friendList, from);
        } else if (type == CHAT_TYPE_GROUP) {
            for (var i = 0; i < $scope.groupList.length; i++) {
                if ($scope.groupList[i].roomId == to) {
                    ret = $scope.groupList[i];
                    break;
                }
            }
        }
        return ret;
    };
    var memHtml = '';
    $scope.enterChat = function (chat, groupList) {

        var obj = {
            "current": chat.name,
            "gList": groupList
        };

        $rootScope.$broadcast('Selected', obj);

        $scope.choo = true;
        memHtml = '';
        $scope.currentChat = chat;
        $scope.currentChat.hasNew = false;
        if ($scope.currentChat.type == CHAT_TYPE_GROUP) {
            webservice.queryRoomMember($scope.currentChat.roomId, function (members) {
                $scope.groupMembers = members;
                console.log($scope.groupMembers);
                for (var i = 0; i < members.length; i++) {
                    memHtml += '<div class="member-opt-item"><img src="sysim/images/default.png" /><br />' + members[i].jid.slice(8, -12) + '</div>'
                }
                console.log(memHtml);

            });
            webservice.queryGroupInfo($scope.currentChat.roomId, function (settings, members, fields) {
                $scope.currentChat.affiliations_count = fields.affiliations;


                $scope.$apply();
            }, function () {
            })
        }
    };
    $scope.sendMessage = function () {
        var messageHtml = editTextarea[0].innerHTML;
        var textHtml = messageHtml;

        // var a = editTextarea[0];
        // var messageHtml = a.innerHTML;
        if (messageHtml === '') {
            alert('发送消息不能为空');
            return;
        }
        if ($scope.currentChat === undefined) {
            alert('请选择发送到哪个群组或好友');
            return;
        }
        $scope.inputMessage = messageHtml;

        var emojiData = [];

        // if(typeof textHtml)

        var result = formatMessage(textHtml);

        // 如果只是一个文本就不用格式化了
        if ("txt" === result[0].type && 1 === result.length) {
            result = textHtml;
        }

        var account = $rootScope.account;

        var msgEmoji = {
            from: $scope.currentUserName,
            data: result,
            ext: {
                "userPic": account.avatar,
                "userName": account.realName
            },
            // data: emojiData.length ? emojiData : $scope.inputMessage,
            time: new Date().Format('yyyy-MM-dd hh:mm:ss')
        };

        // 判断发送的消息是否还有表情，如果有表情，就在传送的消息中放入一个emoji树形来表示其是emoji类型，这样做主要是为了前端页面展示的时候便于区分表情消息
        if (result.toString() !== textHtml.toString()) {
            msgEmoji.emoji = true;
        }


        if (!$scope.currentChat.msglist) $scope.currentChat.msglist = [];
        // $scope.currentChat.msglist.push(msg);

        // 给data中放数据的时候判断进行判断，如果有emoji就放emoji，如果没有就放string
        $scope.currentChat.msglist.push(msgEmoji);


        for (var i = 0, length = emojiMap.length; i < length; i++) {
            var regStr = '<img src="' + emojiMap[i].imageUrl + '">';
            $scope.inputMessage = $scope.inputMessage.replace(regStr, emojiMap[i].emojiText);
        }

        $scope.inputMessage = $scope.inputMessage.replace(/<br>/g, "\n");


        var msg = {
            from: $scope.currentUserName,
            data: $scope.inputMessage,
            time: new Date().Format('yyyy-MM-dd hh.amr:mm:ss')
        };

        if ($scope.currentChat.type == CHAT_TYPE_SINGLE) {
            msg.to = $scope.currentChat.name
        } else if ($scope.currentChat.type == CHAT_TYPE_GROUP) {
            msg.to = $scope.currentChat.roomId
        }
        webservice.sendMessage($scope.currentChat.type, msg.data, msg.to, function () {


            $scope.$apply();
            // $('.webim-msg-data').last().html(messageHtml);
            // var t = angular.element('.webim-msg-data').last().html(messageHtml);
            // angular.element('.emjio-data').last().html(messageHtml);

            emojiMap = [];
            // $('#edit').html("");
            angular.element('#editTextarea').empty();
            $scope.inputMessage = "";

            $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
            console.log($('.webim-chatwindow-msg')[0]);
            console.log($('.webim-chatwindow-msg')[0].scrollHeight);
            console.log($('.webim-chatwindow-msg').scrollTop());
        }, function () {
        });
    };

    // formatMessage函数用作将 表情文本混合的消息解析成 一个个数组，
    //     数据格式如下
    // {
    //     data:"saf;",
    //         type:"txt",
    // }
    // {
    //     data:"sysim\vender\20.png",
    //         type:'emoji'
    // }
    let formatMessage = function (textHtml) {

        let emojiIndx = 0;
        let result = [];

        while (textHtml) {
            // 取出第一个字符
            let k = textHtml.substring(0, 1);

            let eLocal = textHtml.indexOf('<', 0);

            // 如果第一个是emoji
            if (0 === eLocal) {
                let regStr = '<img src="' + emojiMap[emojiIndx++].imageUrl + '">';
                let temp = {
                    type: "emoji",
                    data: emojiMap[emojiIndx - 1].imageUrl,
                };
                // 将这个emoji去掉
                textHtml = textHtml.replace(regStr, '');
                result.push(temp);
            } else if (-1 === eLocal) {
                let tempBox = {
                    type: "txt",
                    data: textHtml,
                };
                textHtml = '';
                result.push(tempBox);

            } else {
                let tempStr = textHtml.substring(0, eLocal);
                let tempBox = {
                    type: "txt",
                    data: tempStr,
                };
                // 将这个字符串去掉
                textHtml = textHtml.replace(tempStr, '');
                result.push(tempBox);
            }
        }

        return result;
    };

    $('#memberOption').popover({
        trigger: 'focus',
        placement: 'bottom',
        html: true,
        content: '<div class="member-opt-panel clearfix">' +
        '<div class="member-opt-item member-opt-btn" data-toggle="model" data-target="#groupModel" onclick="$(\'#groupModel\').modal(\'show\');$(\'#memberOption\').popover(\'toggle\');">+</div>' +
        '<div class="member-opt-item member-opt-btn" data-toggle="model" data-target="#groupModel" onclick="$(\'#groupModel\').modal(\'show\');$(\'#memberOption\').popover(\'toggle\');">-</div>' +

        // '<div class="member-opt-item"><img src="images/default.png" /><br />局长 张某某</div>'+
        // '<div class="member-opt-item"><img src="images/default.png" /><br />局长 张某某</div>'+
        '<div id="memHtmlId"></div>' +
        '</div>'
    });
    $('#memberOption').click(function () {
        $('#memberOption').popover('toggle');
        $("#memHtmlId").html(memHtml);
    });

    $scope.showMenu = function ($event) {
        $('#optMenu').remove().appendTo($('body'));
        $('#optMenu li').click(function () {
            $('#optMenu').hide();
        })
        $('#optMenu').css({
            left: $event.clientX + 'px',
            top: $event.clientY + 'px'
        });
        $('#optMenu').show();
    }
});

imApp.directive('ngContextmenu', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        compile: function ($element, attr) {
            var fn = $parse(attr.ngContextmenu, null, true);
            return function (scope, element) {
                element.on('contextmenu', function (event) {
                    var callback = function () {
                        fn(scope, {
                            $event: event
                        });
                    };
                    scope.$apply(callback);
                    event.preventDefault();
                });
            };
        }
    }
}]);