## angular-confirm
===========================
![angular-confirm](https://github.com/linjinying/angular-components/blob/master/angular-confirm/screenshot.png)  

### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-confirm/)
### 说明
一个基于angular、angular-bootstrap的确认框组件，目前支持的API有：  

- **text** 提示的消息文本
- **confirmTitle** 提示的消息标题
- **confirmOk** 确定按钮的文本
- **confirmCancel** 确定按钮的文本
- **confirmOkColor** 确定按钮的颜色，可以配置基于bootstrap的按钮颜色，例如`default`，`primary`，`danger`等
- **confirmCancelColor** 取消按钮的颜色，可以配置基于bootstrap的按钮颜色，例如`default`，`primary`，`danger`等
- **confirmSettings** 主要用于配置angular-bootstrap的modal参数,例如`backdrop: 'static'`

### 依赖
- angular
- bootstrap.css
- angular-bootstrap 

### 使用方式
#### 1.直接在HTML上使用

**html代码**
```html
<div ng-app="app" ng-controller="ctrl">
    <button class="btn btn-danger" ng-click="refuse()" confirm="确认拒绝吗？" confirm-ok="确定" confirm-cancel="取消" confirm-ok-color="danger" confirm-title="确认消息">拒绝</button>
</div>
```
**angular代码**
```javascript
var app = angular.module("app", ["ui.bootstrap", "ui.confirm"]);
app.controller("ctrl", ['$scope', '$confirm',function($scope,$confirm) {
    $scope.refuse = function(){
        alert("已拒绝");
    };
}])
```
#### 2.动态调用

**html代码**
```html
<div ng-app="app" ng-controller="ctrl">
    <button class="btn btn-default" ng-click="confirm()">确认</button>
</div>
```
**angular代码**
```javascript
var app = angular.module("app", ["ui.bootstrap", "ui.confirm"]);
app.controller("ctrl", ['$scope', '$confirm',function($scope,$confirm) {
    $scope.confirm = function() {
        $confirm({
            text: "您确认了吗？",
            confirmOk: "确定",
            confirmTitle: "提示",
            confirmCancel: "取消",
            confirmOkColor: "danger"
        }).then(function () {
          alert("确认了");
        }, function () {
          alert("取消了");
        });
    };
}]);
```
