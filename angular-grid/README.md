## angular-grid
![angular-grid](https://github.com/linjinying/angular-components/blob/master/angular-grid/screenshot.png)  

### demo
[click here](https://techjs.cn/demo/angular-components/angular-grid/)

### 说明
一个基于bootstrap、angular的性能表现良好的表格组件。  
### API
#### Settings

- `checkbox` 是否显示checkbox，默认为`false`
- `viewportNumbers` 显示表格的行数，默认为`10`行  
- `emptyPlaceholder` 表格为空的提示，默认为`暂无记录`

#### Table Options

- `hidden`是否显示字段，默认为`false`
- `ChineseName`字段中文名
- `width`单元格宽度，可设置数值或`auto`
- `minWidth`单元格最小宽度，数值类型
- `formatDate`时间格式化，支持`yyyy-mm-dd hh:ii:ss`格式
- `toFixed`保留小数点
- `unitText`单元格数据单位
- `transValue`单元数据映射关系，如`{a:1,b:2}`，支持`Object`或函数返回`Object`
- `cellTemplate`单元格渲染html代码，支持template字符串或函数返回

#### Scope Interface  
这两个API主要是暴露给`cellTemplate`使用。  
- **$gridScope** 暴露当前表格的`scope`给外部使用  
- **$rowScope** 暴露当前行的`scope`给外部使用，该`scope`支持刷新视图(`refresh`)，删除(`remove`)。


### 依赖

- jquery
- angular
- bootstrap

### 使用方式


**html代码**

```html
<body ng-app="app" ng-controller="ctrl">
    <angular-table table-options="dataTable"></angular-table>
</body>
```

**angular代码**
```javascript
var app = angular.module("app", ["ui.grid"]);
app.controller("ctrl", ['$scope', 'TableFactory', function($scope, TableFactory) {
    var tableOptions = {
        settings: {
            checkbox: true,
            viewportNumbers: 10,
            emptyPlaceholder: "暂无记录"
        },
        options: {
            name: {
                ChineseName: "名称",
                width: "auto"
            },
            updateOn: {
                ChineseName: "更新时间",
                width: "auto",
                formatDate: "yyyy-mm-dd"
            },
            remark: {
                ChineseName: "备注",
                width: "1000"
            },
            btnOperate: {
                ChineseName: "操作",
                width: "auto",
                cellTemplate: function() {
                    var insertBeforeButtonHtml = "<button ng-click='gridScope.insertBefore(tr,$rowScope);'>刷新</button>";
                    var editButtonHtml = "<button ng-click='gridScope.edit(tr,$rowScope);'>编辑</button>";
                    var removeButtonHtml = "<button ng-click='gridScope.remove($rowScope);'>删除</button>";
                    return insertBeforeButtonHtml+editButtonHtml + removeButtonHtml;
                }
            }
        }
    };

    var dataList = [];
    for (var i = 0; i < 100; i++) {
        dataList.push({
            id: i,
            name: i,
            updateOn: new Date().getTime()+86400000*i,
            remark: "备注信息"+i
        });
    }
    $scope.dataTable = TableFactory.createTable(tableOptions, dataList);
    $scope.edit = function(item, $rowScope) {
        item.name = "渠道副本";
        $rowScope.refresh();
    };
    $scope.remove = function($rowScope) {
        $rowScope.remove();
    };
}]);
```
