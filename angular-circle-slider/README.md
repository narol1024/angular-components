###angular-circle-slider
===========================
![angular-circle-slider](https://github.com/linjinying/angular-components/blob/master/angular-circle-slider/screenshot.png)  

### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-circle-slider/)

### 说明
一个基于angularJS的圆形slider(a circular slider based on angularJS)，目前支持的API有： 
- **value**  初始化的数据
- **readonly** 只读
- **onStart** `function(value){}`开始滚动事件
- **onFinish** `function(value){}`结束滚动事件
- **onChange** `function(value){}`滑动Change事件

#### Requirements
- **jquery**
- **angular**

#### Basic Usage

**html代码** 
```html
<div circle-slider="options"></div>
```
**angular代码**  
```javascript
var app = angular.module('app', ['ui.circleSlider']);
app.controller('ctrl', ['$scope', function($scope) {
    $scope.options = {
    	value:60,
        onStart:function(value){
            console.info('startValue:' + value);
        },
        onChange:function(value){
            console.info('currentValue:' + value);
        },
        onFinish:function(value){
            console.info('endValue:' + value);
        }
    }
}]);
```
#### Support
`ie9+`  `chrome` `firefox` `safari`

####License
--------
This plugin is licensed under the MIT license.

Copyright (c) 2016 linjinying