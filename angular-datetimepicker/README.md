## angular-datetimepicker
![angular-confirm](https://github.com/linjinying/angular-components/blob/master/angular-datetimepicker/screenshot.png)  

### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-datetimepicker/)
### 说明
一个基于angular、bootstrap-datetimepicker的时间选择器，目前支持的API有：  
- **ngModel** 接收时间格式为 yyyy-mm-dd hh:ii:ss  
- **format** 时间格式化，时间格式为yyyy-mm-dd hh:ii:ss  
- **limitStartTime** 限制允许选择的开始时间  
- **limitEndTime** 限制允许选择的结束时间  
- **clearBtn** 是否显示清除按钮  
- **removeDatetimepicker** 移除该时间选择器的函数

### 依赖

- angular
- angular-datetime
- [bootstrap-datetimepicker](https://github.com/linjinying/bootstrap-datetimepicker)

### 注意

bootstrap-datetimepicker存在一些bug，所有基于此插件fork一个新的版本修复已知的bug，可以去我的[github](https://github.com/linjinying/bootstrap-datetimepicker)下载。

### 使用方式  

**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
    <form class="form-inline" role="form">
        <div class="form-group">
            <label class="sr-only" for="exampleInputEmail2">选择的时间</label>
            <input type="text" datetimepicker="options" class="form-control" name="date" ng-model="date" placeholder="请输入时间" required readonly="readonly" />
        </div>
    </form>
</body>
```

**angular代码**
```javascript 
var app = angular.module("app", ["ui.datetimepicker"]);
app.controller("ctrl", ['$scope', function($scope) {
    $scope.options = {
        format: "yyyy-mm-dd"
    };
}]);
```