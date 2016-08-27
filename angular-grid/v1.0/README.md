## angular-grid
### 版本
version 1.0
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
      formatDate: "yyyy-mm-dd hh:ii:ss",//时间格式化。
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
app.controller("ctrl", ['$scope','TableFactory', function($scope,TableFactory) {
    var tableOptions = {
        settings:{
            checkbox:true
        },
        options: {
            name: {
                ChineseName: "渠道名称",
                width: "260"
            },
            updateOn: {
                ChineseName: "最后更新时间",
                width: "180",
                formatDate: "yyyy-mm-dd hh:ii:ss"
            },
            remark: {
                ChineseName: "备注",
                width: "auto"
            },
            btnOperate: {
                ChineseName: "操作",
                width: "82",
                cellTemplate: function() {
                    var editButtonHtml = "<button class='btn btn-primary' ng-click='gridScope.edit(tr)'><span class='icon icon-edit'></span><span class='text'>编辑</span></button>";
                    return editButtonHtml;
                }
            }
        }
    };
    var dataList = [
        {name:"test",updateOn:"1467010946113",remark:"备注信息"},
        {name:"test2",updateOn:"1467010964269",remark:"备注信息2"},
    ];
    $scope.dataTable = TableFactory.createTable(tableOptions, dataList);
    $scope.edit = function(item){
        alert("你是否要编辑"+item.name+"?")
    };
}]);
```

### future
- 优化性能，尽量减少wather的数量
- 固定表头
- 固定列

