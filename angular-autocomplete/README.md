## angular-autocomplete
### 版本
version 1.0.0

### 说明

一个基于jQuery-Autocomplete插件的angular组件，目前支持的功能：  

- **basic-options**  jQuery-Autocomplete的基本配置
- **onSelectCallback** 选中项的callback函数
- **onSearchCompleteCallback** 搜索完成的callback函数


### 依赖
- jquery
- jQuery-Autocomplete
- angular


### 使用


**html代码**
```html
<div ng-app="app" ng-controller="ctrl">
    <input ng-model="loginName" type="text" name="loginName" angular-autocomplete autocomplete-Options="loginNameOptions" placeholder="请输入用户名" />
</div>
```
**angular代码**
```javascript
var app = angular.module("app", ["ui.autocomplete"]);
app.controller("ctrl", ["$scope", function($scope) {
    $scope.loginName = "test";
    var countries = [{
        value: 'Andorra',
        data: 'AD'
    }, {
        value: 'Zimbabwe',
        data: 'ZZ'
    }, {
        value: 'dada',
        data: 'ZZ'
    }];
    $scope.loginNameOptions = {
        paramName: "q",
        //serviceUrl: '/uws/promotion/autoCompleteEnterpriseUser',
        lookup: countries,
        dataType: "json",
        noCache: true,
        deferRequestBy: 300,
        transformResult: function(response) {
            return {
                suggestions: $.map(response.data, function(dataItem) {
                    return {
                        value: dataItem.value,
                        data: dataItem.key
                    };
                })
            };
        },
        onSelectCallback:function(suggestion){
            console.log(suggestion);
        },
        onSearchCompleteCallback:function(query, suggestions){
            console.log(query, suggestions);
        }
    }
}]);
```

### future
根据业务需求，参考jQuery-Autocomplete插件扩展功能。