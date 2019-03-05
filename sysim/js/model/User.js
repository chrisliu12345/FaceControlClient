//当前用户
imApp.service('user', function($rootScope,webservice){
    this.status = LOGIN_STATUS_ACTIVE;
    this.name ='';
    this.avatar = '';
    var self = this;
    
    $rootScope.$on(WEB_EVENT_LOGINED, function(event, data){
        self.status = LOGIN_STATUS_ACTIVE;
    });
    $rootScope.$on(WEB_EVENT_LOGOUTED, function(event, data){
        self.status = LOGIN_STATUS_DEACTIVE;
    })
    
    this.login = function(username,password){
        this.name = username;
        webservice.login(username, password);

    }
    this.logout = function(){
        webservice.logout();
    }
})