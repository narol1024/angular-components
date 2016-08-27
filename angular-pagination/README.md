## angular-pagination
### 版本
version 1.0.0
### 说明
基于bootstrap-angular的分页组件的二次封装，目前支持的API有：  
- **basic**  基本功能，目前实现的功能有分页，分页跳转，分页总数，总条数。  
- **queryList** 翻页触发的回调函数  


### 依赖
- angular  
- angular-bootstrap    

### 注意

在使用前，必须设置分页的参数，如  
```javascript
$scope.page = {
	totalCount: 100,
	pageNo: 1,
	totalPageCount: 10,
	maxSize: 5,
	pageSize: 10
};
````

### 使用方式  

**html代码**  
```html
<body ng-app="app" ng-controller="ctrl">
    <angular-pagination query-list="queryList()" page="page"></angular-pagination>
</body>
```

**angular代码**  
```javascript
var app = angular.module("app", ["ui.bootstrap","ui.pagination"]);
app.controller("ctrl", ["$scope", function($scope) {
    $scope.page = {
        totalCount: 100,
        pageNo: 1,
        totalPageCount: 10,
        maxSize: 5,
        pageSize: 10
    };
}]);
```
### future
根据业务需求，自己扩展想要的功能。