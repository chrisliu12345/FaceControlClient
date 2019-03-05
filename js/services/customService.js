'use strict';

angular.module("customServices", [])
    .factory("logService", function () {
        var messageCount = 0;

        return {
            log: function (msg) {
                console.log("(LOG + " + messageCount++ + ") " + msg);
            }
        };
    })

    .factory("autoLogin", function () {
        var autoLoginIn;

        return {
            set: function (isAuto) {
                autoLoginIn = isAuto;
            },

            get: function () {
                return autoLoginIn;
            }
        };

    });