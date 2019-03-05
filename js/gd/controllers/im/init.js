var friends = new Array();
var conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});
conn.listen({
    onOpened: function (message) {          //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        console.log("opended!")
        // listRooms();
        //friends = getFridens();
        console.log(getFridens());
    },
    onClosed: function (message) {
    },         //连接关闭回调
    onTextMessage: function (message) {
    },    //收到文本消息
    onEmojiMessage: function (message) {
    },   //收到表情消息
    onPictureMessage: function (message) {
    }, //收到图片消息
    onCmdMessage: function (message) {
    },     //收到命令消息
    onAudioMessage: function (message) {
    },   //收到音频消息
    onLocationMessage: function (message) {
    },//收到位置消息
    onFileMessage: function (message) {
    },    //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
                'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function (message) {
    },       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function (message) {
    },         //处理好友申请
    onInviteMessage: function (message) {
    },  //处理群组邀请
    onOnline: function () {

    },                  //本机网络连接成功
    onOffline: function () {
    },                 //本机网络掉线
    onError: function (message) {
    },          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    }
});

var options = {
    apiUrl: WebIM.config.apiURL,
    user: 'douya',
    pwd: '123456',
    appKey: WebIM.config.appkey
};
conn.open(options);
var listRooms = function () {
    var option = {
        apiUrl: 'https://a1.easemob.com',
        pagenum: 1,                                 // 页数
        pagesize: 20,                               // 每页个数
        success: function (list) {
            console.log(list);
        },
        error: function () {
            console.log('List chat room error');
        }
    };
    conn.getChatRooms(option);
};
listRooms();
function getFridens() {
    var f = new Array();
    conn.getRoster({

        success: function (roster) {
            console.log("haoyou2");
            //获取好友列表，并进行好友列表渲染，roster格式为：
            /** [
             {
               jid:'asemoemo#chatdemoui_test1@easemob.com',
               name:'test1',
               subscription: 'both'
             }
             ]
             */
            for (var i = 0, l = roster.length; i < l; i++) {
                //var ros = roster[i];
                //ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
                f[i] = roster[i];
            }

        }
        ,
    })
    return f;
}

;