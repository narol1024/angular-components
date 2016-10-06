## angular-checkbox
### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-checkbox/)

### 说明
一个基于angular的checkbox组件，目前支持的功能：  

- **value** 文本显示
- **onCheck** 勾选回调函数

### 依赖
- angular

### 使用
**html代码**
```html
<body ng-app="app" ng-controller="ctrl">
    <input angular-checkbox="options" type="checkbox" name="checkbox" ng-model="checked" ng-true-value="'YES'" ng-false-value="'NO'" value="click me!" />
    <h3>{{checked}}</h3>
</body>
```
**angular代码**
```javascript
var app = angular.module("app", ["ui.checkbox"]);
app.controller("ctrl", ['$scope', function($scope) {
    $scope.checked = "YES";
    $scope.options = {
        onCheck:function(){
        }
    }
}]);
```