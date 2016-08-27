## angular-datetimepicker
### 版本
version 1.0.0
### 说明
一个基于angular、bootstrap-datetimepicker的时间选择器，目前支持的API有：  
- **ngModel** 接收时间格式为 yyyy-mm-dd hh:ii:ss或时间戳  
- **format** 时间格式化，支持yyyy-mm-dd或yyyy-mm-dd hh:ii:ss  
- **limitStartTime** 限制允许选择的开始时间  
- **limitEndTime** 限制允许选择的结束时间  
- **clearBtn** 是否显示清除按钮  
- **removeDatetimepicker** 移除该时间选择器的函数

### 依赖

- angular
- angular-datetime
- bootstrap-datetimepicker

### 注意

bootstrap-datetimepicker存在一些bug，所有基于此插件fork一个新的版本修复已知的bug，可以去我的[github](https://github.com/linjinying/bootstrap-datetimepicker)下载。

### 使用方式  

**html代码**  
```html
<div ng-app="app" ng-controller="ctrl">
	<input type="text" datetimepicker class="form-control" name="graduationDate" ng-model="graduationDate" placeholder="请输入毕业时间" required readonly="readonly"/>
</div>
```

**angular代码**  
```javascript
var app = angular.module("app", ["ui.datetimepicker"]);
app.controller("ctrl", ['$scope', function($scope) {
}]);
```
### future
根据业务需求，自己扩展想要的功能。