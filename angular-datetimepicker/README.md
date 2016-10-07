## angular-datetimepicker
===========================
![angular-datetimepicker](https://github.com/linjinying/angular-components/blob/master/angular-datetimepicker/screenshot.png)  
![angular-datetimepicker](https://github.com/linjinying/angular-components/blob/master/angular-datetimepicker/screenshot2.png)  
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
- **relativeGroup** 关联时间组合，见下面扩展

### 依赖

- angular
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

### 扩展
考虑到时间组合起来使用的频率是非常高，这里扩展了一个API：`relativeGroup`函数，用于限制时间组合的时间可选范围，函数返回对象的例子如下:  
```javascript
{
	"groudId":"startTime",//或endTime,标识组件是开始时间还是结束时间
	"relativeDatetime":scope.endTime,//或scope.startTime,关联另外一个scope
	"relativeOptions":scope.endTimeOptions//或scope.startTimeOptions,关联另外一个配置项目
}
```
**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
    <form class="form-inline" role="form">
        <div class="form-group">
            <label class="control-label">请选择：</label>
            <input type="text" datetimepicker="startTimeOptions" class="form-control" name="startTime" ng-model="startTime" placeholder="请输入开始时间" required readonly="readonly" />
            <label class="control-label">-</label>
            <input type="text" datetimepicker="endTimeOptions" class="form-control" name="endTime" ng-model="endTime" placeholder="请输入结束时间" required readonly="readonly" />
        </div>
    </form>
</body>
```

**angular代码**
```javascript 
var app = angular.module("app", ["ui.datetimepicker"]);
app.controller("ctrl", ['$scope', function($scope) {
    $scope.startTimeOptions = {
        limitStartTime:"2016-09-02",
        limitEndTime:"2016-09-22",
        relativeGroup: function() {
            return {
                groupId:"startTime",
                relativeDatetime: $scope.endTime,
                relativeOptions: $scope.endTimeOptions
            }
        }
    };
    $scope.endTimeOptions = {
        limitStartTime:"2016-09-01",
        limitEndTime:"2016-09-30",
        relativeGroup: function() {
            return {
                groupId:"endTime",
                relativeDatetime: $scope.startTime,
                relativeOptions: $scope.startTimeOptions
            }
        }
    };
}]);
```