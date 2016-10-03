angular.module('ui.grid').factory('TableFactory', [function() {
    var Table = {};
    Table.defaultSettings = {
        checkbox: false,
        viewportNumbers: 10,
        _emptyBodyHeight:80
    };
    /*构建TableList*/
    Table.createTable = function(tableOptions, tableList) {
        var tableSettings = angular.extend({}, Table.defaultSettings, tableOptions.settings);
        var tableOptions = tableOptions.options;
        /*在tableOptions没有定义的字段，默认用hidden隐藏*/
        var tableOptionsKeys = {};
        for (var key in tableList[0]) {
            if (tableList[0].hasOwnProperty(key) && !tableOptions[key]) {
                tableOptionsKeys[key] = {
                    hidden: true
                };
            }
        }
        tableOptions = angular.extend({}, tableOptions, tableOptionsKeys);

        var constructTableOptions = function() {
            var optionsObject = {};
            for (var item in tableOptions) {
                if (angular.isFunction(tableOptions[item].hidden)) {
                    tableOptions[item].hidden = tableOptions[item].hidden() || false;
                }
                optionsObject[item] = angular.extend({}, tableOptions[item]);
            }
            return optionsObject;
        };
        var constructTableRow = function(proxyLists) {
            var rowObject = {};
            for (var mapping in tableOptions) {
                rowObject[mapping] = proxyLists[mapping];
            }
            return rowObject;
        }
        var constructTableList = function() {
            var listObject = [];
            for (var i = 0; i < tableList.length; i++) {
                var row = constructTableRow(tableList[i]);
                renderCellTemplate(row);
                listObject.push(row);
            }
            return listObject;
        };
        /*渲染单元格html代码*/
        var renderCellTemplate = function(row) {
            for (var mapping in tableOptions) {
                if (tableOptions[mapping].cellTemplate) {
                    row[mapping] = tableOptions[mapping].cellTemplate();
                }
            }
        };
        return {
            refresh:function(){
                this._watcherId = new Date().getTime();
            },
            _watcherId: new Date().getTime(),
            tableSettings: tableSettings,
            tableOptions: constructTableOptions(),
            tableList: constructTableList()
        };
    };
    return Table;
}]);
