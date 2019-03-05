/**
 * Created by seshi on 2017/6/12.
 */
angular.module('eventDispatcher', [])
.service("BroadcastEventDispatcher", function ($rootScope) {
    return {
        batchUpdateUserOrg: function (orgId, org) {
            $rootScope.$broadcast("BatchUpdateUserOrg", {
                orgId: orgId,
                org: org
            })
        },

        batchDeleteUser: function (data) {
            $rootScope.$broadcast("DeleteUsers", data);
        }
    }
});