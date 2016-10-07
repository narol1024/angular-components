/*
 - @Component Name:用于根据权限数据是否显示按钮的指令，调用方式很简单:has-permission="edit"
 - @Author: jinying.lin
 - @DateTime: 2016-06-14
 - @Version 1.0.0
*/
angular.module("ngPermission",[])
.provider('ngPermission', function () {
   var service = {};
   this.setData = function(data){
       service.data = data;
   };
   this.$get = function () {
       return service;
   }
})
.directive('hasPermission', ["ngPermission",function(ngPermission) {
    return {
        restrict: "EA",
        link: function(scope, element, attr) {
            var permissionName = attr.hasPermission;
            var isPermission = false;
            for (var i = 0; i < ngPermission.data.length; i++) {
                if (permissionName === ngPermission.data[i]) {
                    isPermission = true;
                }
            }
            if (!isPermission) {
                element.remove();
            }
        }
    };
}]);
