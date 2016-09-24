## angular-datetime

### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-datetime/)

### 说明
一个基于angular的时间工具类，目前支持的API有：  

- **isDate** 检测是否为时间对象
- **newDate** 字符串转换成时间对象，支持时间戳、标准时间参数或yyyy-mm-dd hh:ii:ss非标准格式，返回时间对象。
- **format** 时间对象格式化，返回yyyy-mm-dd hh:ii:ss
- **getSomeDate** 获取某日期的前后n天，返回yyyy-mm-dd
- **getSomeMonth** 获取上一个月的日期，返回yyyy-mm-dd

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