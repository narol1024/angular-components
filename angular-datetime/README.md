## angular-datetime

### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-datetime/)

### 说明
一个基于angular的时间工具类，目前支持的API有：  

- **isDate** `function(date){}`检测`date`是否为时间对象
- **newDate** `function(dateStr){}`转换成时间对象，支持时间戳、标准时间参数或`yyyy-mm-dd hh:ii:ss`非标准格式，返回时间对象。
- **format** `function(date,format){}`时间对象格式化成`yyyy-mm-dd hh:ii:ss`形式
- **getSomeDate** `function(date,count,format){}`获取`date`日期的前后`count`天，有`format`返回时间格式化字符串，否则返回时间对象
- **getSomeMonth** `function(date,count,format){}`获取`date`日期的前后`count`月，传有`format`返回时间格式化字符串，否则返回时间对象

### 依赖
- angular

### 使用方式  
**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
    <p>
    	<b>当前时间：</b><span ng-bind="currentTime"></span>
    </p>
    <p>
    	<b>上个月：</b><span ng-bind="prevMonthTime"></span>
    </p>
    <p>
    	<b>下个月：</b><span ng-bind="nextMonthTime"></span>
    </p>
    <p>
    	<b>昨天：</b><span ng-bind="prevDateTime"></span>
    </p>
    <p>
    	<b>明天：</b><span ng-bind="nextDateTime"></span>
    </p>
</body>
```

**angular代码**  
```javascript
var app = angular.module("app", ['ngDatetime']);
app.controller("ctrl", ['dateTimeFactory', "$scope",function(dateTimeFactory,$scope) {
	$scope.currentTime = dateTimeFactory.format(new Date(),'yyyy-mm-dd');
	$scope.prevMonthTime = dateTimeFactory.getSomeMonth(new Date(),-1,'yyyy-mm-dd');
	$scope.nextMonthTime = dateTimeFactory.getSomeMonth(new Date(),1,'yyyy-mm-dd');
	$scope.prevDateTime = dateTimeFactory.getSomeDate(new Date(),-1,'yyyy-mm-dd');
	$scope.nextDateTime = dateTimeFactory.getSomeDate(new Date(),1,'yyyy-mm-dd');
}]);
```