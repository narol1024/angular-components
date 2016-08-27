## angular-checkbox
### 版本
version 1.0.0

### 说明
一个基于angular的checkbox组件，目前支持的功能：  

- **basic** 基本的勾选功能
- **onCheck** 勾选回调函数

### 依赖
- angular
- font-awesome(用于chebox图标)  

### 使用
**html代码**
```html
<div ng-app="app" ng-controller="ctrl">
	<angular-checkbox ng-model="checkbox.checked" default-value="false" target-value="true" check-text="{{checkbox.name}}" on-check="check(checkbox)"></angular-checkbox>{{checkbox.checked}}
</div>
```
**angular代码**
```javascript
var app = angular.module("app", ["ui.checkbox"]);
app.controller("ctrl", ['$scope', function($scope) {
    $scope.checkbox = {
		checked:false,
		name:"点我"
	};
    $scope.check = function(item){
        console.info(item);
    };
}]);
```

### future
建议对UI层面进行优化，不再依赖字体图标。