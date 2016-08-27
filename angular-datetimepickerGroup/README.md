## angular-datetimepicker-group
### 版本
version 1.0.0
### 说明
一个基于bootstrap-datetimepicker、angular、angular-datetimepicker的时间组合选择器，目前支持的API有：  
- **limitOutTime** 是否限制开始时间不能超过结束时间，默认为false，不限制  
- **limitStartTime** 限制允许选择的开始时间  
- **limitEndTime** 限制允许选择的结束时间  
- **startTimePlaceholder** 开始时间的placeholder  
- **endTimePlaceholder** 结束时间的placeholder  
- **startName** 开始时间的表单name
- **endName** 结束时间的表单name  
- **readOnly** 是否允许输入时间，默认为true，不允许输入  
- **required** 是否必选,默认为false，不必选  
- **disabled** 是否禁用，默认为false，不禁用  
- **removeDatetimepicker** 移除该时间选择器的函数  

### 依赖

- angular
- angular-datetime
- angular-datetimepicker  
- bootstrap-datetimepicker  


### 使用方式  

**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
	<datetimepicker-group options="dateTimeOptions" start-time="startTime" end-time="endTime" start-name="startTime" end-name="endTime"></datetimepicker-group>
</body>
```

**angular代码**  
```javascript
var app = angular.module("app", ["ui.datetimepickerGroup"]);
app.controller("ctrl", ['$scope', function($scope) {
    $scope.dateTimeOptions = {
        limitOutTime:true,
        limitEndTime: "2016-07-14"
    };
}]);
```
### future
根据业务需求，自己扩展想要的功能。
