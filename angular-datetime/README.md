## angular-datetime
### 版本
version 1.0.0
### 说明
一个基于angular的时间格式化组件，目前支持的API有：  

- **newDate** 字符串转换成时间对象，支持时间戳、yyyy-mm-dd hh:ii:ss格式，返回时间对象。
- **format** 时间对象格式化，返回yyyy-mm-dd hh:ii:ss
- **getDate** 获取某日期的前后n天，返回yyyy-mm-dd
- **getPreMonth** 获取上一个月的日期，返回yyyy-mm-dd
- **getNextMonth** 获取下一个月的日期，返回yyyy-mm-dd

### 依赖
- angular

### 使用方式  
**html代码**  
```html
<div ng-app="app" ng-controller="ctrl">
</div>
```

**angular代码**  
```javascript
var app = angular.module("app", ['ngDatetime']);
app.controller("ctrl", ['dateTimeFactory', "$scope",function(dateTimeFactory,$scope) {
	//转换成时间对象
	$scope.datetime1 = dateTimeFactory.newDate("2016-01-10 12:00:03");
	//格式成yyyy-mm-dd hh:ii:ss
	$scope.datetime2 = dateTimeFactory.format(new Date(),'yyyy-mm-dd hh:ii:ss');
	//获取前第三天的日期
	$scope.datetime3 = dateTimeFactory.getDate(new Date(),-3);
	//获取上个月的日期
	$scope.datetime4 = dateTimeFactory.getPreMonth(new Date());
	//获取下个月的日期
	$scope.datetime4 = dateTimeFactory.getNextMonth(new Date());
}]);
```
### future
根据业务需求，自己扩展时间方面的功能。