## angular-grid
### 版本
version 1.1
### 说明
一个基于bootstrap、angular的表格组件，目前支持的API有：

- **settings** 基本设置
  checkbox 是否允许勾选表格，默认为false
- **options** 表格单元格配置

```javascript
options:{
   id:{
	  hidden:false,//是否显示字段，默认不定义。
      ChineseName:"ID",//中文名。
	  width:"auto",//单元格宽度，数值或`auto`。
      minWidth:"100",//最小单元格宽度，支持数值
      formatDate: "yyyy-mm-dd hh:ii:ss",//时间格式化。
	  toFixed: 2,//保留小数点。
      unitText:"$",//数据的单位
	  transValue:{
		"1":"一",
		"2":"二"
	  },//单元格转换映射，支持Object或函数返回Object，如{list:[{id:"1",name:"一"},{id:"2",name:"二"}]，key:"id",value:"name"}]
	  cellTemplate:function(){
		  return "<button>按钮</button>";//返回html代码，单元格渲染html代码。
      },
   },
}
```
- **$gridScope** 暴露当前表格的`scope`给外部使用
- **$rowScope** 暴露当前行的`scope`给外部使用，该scope支持刷新视图(refresh)，删除(remove)。


### 依赖

- jquery
- angular
- angular-datetime
- bootstrap
- font-awesome

### 使用方式


**html代码**

```html
<body ng-app="app" ng-controller="ctrl">
    <angular-table table-params="dataTable"></angular-table>
</body>
```

**angular代码**
```javascript
var app = angular.module("app", ["ui.grid"]);
app.controller("ctrl", ['$scope', 'TableFactory', "$timeout", function($scope, TableFactory, $timeout) {
    var tableOptions = {
        settings: {
            checkbox: true
        },
        options: {
            name: {
                ChineseName: "渠道名称",
                width: "560"
            },
            updateOn: {
                ChineseName: "最后更新时间",
                width: "580",
                formatDate: "yyyy-mm-dd hh:ii:ss"
            },
            remark: {
                ChineseName: "备注",
                width: "100"
            },
            test1: {
                ChineseName: "test1",
                width: "100",
                toFixed:2
            },
            test2: {
                ChineseName: "test2",
                width: "500"
            },
            test3: {
                ChineseName: "test3",
                width: "100"
            },
            btnOperate: {
                ChineseName: "操作",
                width: "auto",
                cellTemplate: function() {
                    var editButtonHtml = "<button ng-click='gridScope.remove($rowScope);'>删除</button>";
                    return editButtonHtml;
                }
            }
        }
    };
    $scope.test = "测试";
    var dataList = [{
        id: 1,
        name: "test",
        updateOn: "1467010946113",
        remark: "备注信息",
        test1: "1235.5566",
        test2: "test2",
        test3: "test3"
    }, {
        name: "test2",
        updateOn: "1467010964269",
        remark: "备注信息2",
        test1: "",
        test2: "test2",
        test3: "test3"
    }, {
        name: "test",
        updateOn: "1467010946113",
        remark: "备注信息",
        test1: "1235.5566",
        test2: "test2",
        test3: "test3"
    }, {
        name: "test2",
        updateOn: "1467010964269",
        remark: "备注信息2",
        test1: "1235.5566",
        test2: "test2",
        test3: "test3"
    }, {
        name: "test",
        updateOn: "1467010946113",
        remark: "备注信息",
        test1: "1235.5566",
        test2: "test2",
        test3: "test3"
    }];
    $timeout(function() {
        $scope.dataTable = TableFactory.createTable(tableOptions, dataList);
    }, 1000);
    $scope.edit = function(item,thisScope) {
        item.test3 ="哈哈哈";
        thisScope.refresh();
    };
    $scope.remove = function($rowScope){
        $rowScope.remove();
    };
}]);
```

### future
- 优化性能，尽量减少wather的数量
- 固定表头
- 固定列