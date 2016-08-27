## angular-permission
### 版本
version 1.0.0
### 说明
一个基于angular的视图权限指令
### 依赖  
- angular 


### 使用方式  

**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
    <button has-permission="edit">权限按钮</button>
</body>
```

**angular代码**  
```javascript
var app = angular.module("app", ["ngPermission"]);
var data = ["add", "edit"];
app.config(["ngPermissionProvider", function(ngPermissionProvider) {
    ngPermissionProvider.setData(data);
}]);
app.controller("ctrl", ["$scope", function($scope) {
}]);
```
### future
根据业务需求，自己扩展想要的功能。