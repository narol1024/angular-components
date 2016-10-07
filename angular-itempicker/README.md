## angular-itempicker
===========================
![angular-itempicker](https://github.com/linjinying/angular-components/blob/master/angular-itempicker/screenshot.png)  

### demo
[click here](http://www.w3cin.com/demo/angular-components/angular-itempicker/)

### 说明
一个基于angular和angular-checkbox的双栏穿梭框： 
### API

#### Settings
- **key** 数据值索引，默认为`id`  
- **value** 数据值，默认为`name`  
- **showSearch** 是否显示搜索栏，默认为true  
- **searchPlaceholder** 搜索的文案，默认为`请输入搜索内容`   

#### List
- **sourceList** 左栏数据源，格式为json数组，默认为空  
- **targetList** 右栏数据源，格式为json数组，默认为空  

### 依赖
- angular
- angular-checkbox  

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
        sourceList: [{
            "id": 1,
            "name": "Karry"
        }, {
            "id": 1,
            "name": "Karry"
        }, {
            "id": 3,
            "name": "Narol"
        }, {
            "id": 4,
            "name": "Leb"
        }, {
            "id": 5,
            "name": "Cok"
        }, {
            "id": 6,
            "name": "Yol"
        }, {
            "id": 7,
            "name": "Keb"
        }, {
            "id": 8,
            "name": "Tex"
        }, {
            "id": 9,
            "name": "Hok"
        }, {
            "id": 10,
            "name": "Zero"
        }],
        targetList: []
    };
}]);
```