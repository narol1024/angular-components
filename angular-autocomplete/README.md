## angular-autocomplete
### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-autocomplete/demo/)

### 说明

一个基于jQuery-Autocomplete的angular wrapper组件。理论上，支持jQuery-Autocomplete的所有功能。


### 依赖
- jquery
- jQuery-Autocomplete
- angular


### 使用


**html代码**
```html
<div ng-app="app" ng-controller="ctrl">
    <input ng-model="loginName" type="text" name="loginName" angular-autocomplete autocomplete-Options="loginNameOptions" placeholder="请输入用户名" />
</div>
```
**angular代码**
```javascript
var app = angular.module("app", ["ui.autocomplete"]);
app.controller("ctrl", ["$scope", function($scope) {
    var countries = [{
        value: 'autocomplete',
        data: '1'
    }, {
        value: 'jquery',
        data: '2'
    }, {
        value: 'angular',
        data: '3'
    }];
    $scope.options = {
        lookup: countries,
        dataType: "json",
        noCache: true,
        deferRequestBy: 300,
        onSelect:function(suggestion){
           console.log(suggestion);
        }
    };
}]);
```