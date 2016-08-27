## angular-itempicker
### 版本
version 1.0.0
### 说明
一个基于bootstrap、angular的双栏穿梭框，目前支持的API有：  
- **key** 数据值索引，默认为`id`  
- **value** 数据值的key，默认为`name`  
- **showSearch** 是否显示搜索栏，默认为true  
- **searchPlaceholder** 搜索的文案，默认为`请输入搜索内容`  
- **sourceList** 左栏数据源，格式为json数组，默认为空  
- **targetList** 右栏数据源，格式为json数组，默认为空  

### 依赖
- angular
- angular-checkbox  
- bootstrap

### 使用方式  

**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
    <angular-itempicker options="pickItemParams"></angular-itempicker>
</body>
```

**angular代码**  
```javascript
var app = angular.module("app", ['ui.itempicker']);
app.controller("ctrl", ['$scope', function($scope) {
    $scope.pickItemParams = {
        settings: {
            key: "id",
            value: "name",
            searchPlaceholder: "请输入搜索内容"
        },
        sourceList: [{"id":48,"name":"11(shan123)"},{"id":49,"name":"12(shan123)"},{"id":50,"name":"13(shan123)"},{"id":51,"name":"14(shan123)"},{"id":52,"name":"15(shan123)"},{"id":53,"name":"16(shan123)"},{"id":54,"name":"17(shan123)"},{"id":55,"name":"18(shan123)"},{"id":56,"name":"19(shan123)"},{"id":57,"name":"20(shan123)"}],
        targetList: []
    };
}])
```
### future
根据业务需求，自己扩展想要的功能。
