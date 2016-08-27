## angular-grid
### 版本
version 1.2
### 说明
一个基于bootstrap、angular的表格组件，目前支持的API有：  

- **settings** 基本设置  
  checkbox 是否允许勾选表格，默认为false  
  viewportNumbers 显示表格的行数，默认为10行  
  emptyPlaceholder 表格为空的提示，默认为“暂无记录”  
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
      }
   }
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
app.controller("ctrl", ['$scope', 'TableFactory', function($scope, TableFactory) {
    var tableOptions = {
        settings: {
            checkbox: true,
            viewportNumbers: 10,
            emptyPlaceholder: "暂无记录"
        },
        options: {
            channelName: {
                ChineseName: "渠道名称",
                width: "auto"
            },
            updateOn: {
                ChineseName: "最后更新时间",
                width: "auto",
                formatDate: "yyyy-mm-dd hh:ii:ss"
            },
            remark: {
                ChineseName: "备注",
                width: "auto"
            },
            test1: {
                ChineseName: "test1",
                width: "100",
                toFixed: 2
            },
            test2: {
                ChineseName: "test2",
                width: "100"
            },
            test3: {
                ChineseName: "test3",
                width: "100"
            },
            test4: {
                ChineseName: "test4",
                width: "100"
            },
            test5: {
                ChineseName: "test",
                width: "10"
            },
            test6: {
                ChineseName: "test6",
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
            channelName: i,
            updateOn: new Date().getTime(),
            remark: "备注信息",
            test1: i * 100,
            test2: i * 100,
            test3: i * 100,
            test4: i * 100,
            test5: i * 100,
            test6: i * 100
        });
    }
    $scope.dataTable = TableFactory.createTable(tableOptions, dataList);
    $scope.edit = function(item, $rowScope) {
        item.test1 = "44.34";
        $rowScope.refresh();
    };
    $scope.remove = function($rowScope) {
        $rowScope.remove();
    };
}]);
```

### future
- 优化性能，尽量减少wather的数量
- 固定列

