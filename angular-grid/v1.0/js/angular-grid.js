/*
版本：v1.0
 */
angular.module('ui.grid', ["ngDatetime"])
    .factory('TableHelper', [function() {
        var Helper = {};
        //underscore throttled code
        Helper.throttled = function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function() {
                previous = options.leading === false ? 0 : Date.now || new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var now = Date.now || new Date().getTime();;
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };
        return Helper;
    }])
    .factory('TableFactory', ['$http', 'TableHelper', function($http, TableHelper) {
        var Table = {};
        Table.defaultSettings = {
            checkbox: false
        };
        /*构建TableList*/
        Table.createTable = function(tableOptions, tableList) {
            var tableSettings = angular.extend({}, Table.defaultSettings, tableOptions.settings);
            var tableOptions = tableOptions.options;
            if (!tableList || tableList.length === 0) {
                return {
                    tableList: []
                };
            }
            /*在tableOptions没有定义的字段，默认用hidden隐藏*/
            var tableOptionsKeys = {};
            for (var key in tableList[0]) {
                if (tableList[0].hasOwnProperty(key) && !tableOptions[key]) {
                    tableOptionsKeys[key] = {
                        hidden: true
                    };
                }
            }
            /*showDisplay，可根据条件决定改列要不要显示*/
            for (var key in tableOptions) {
                var showDisplayCondition = tableOptions[key].showDisplay;
                if (showDisplayCondition && !showDisplayCondition()) {
                    tableOptions[key].hidden = true;
                } else {
                    tableOptions[key].hidden = false;
                }
            }
            tableOptions = angular.extend({}, tableOptions, tableOptionsKeys);

            var constructTableOptions = function() {
                var optionsObject = {};
                for (var item in tableOptions) {
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
            var result = {
                tableSettings: tableSettings,
                tableOptions: constructTableOptions(),
                tableList: constructTableList()
            };
            return result;
        };

        return Table;
    }])
    .filter('tdTrans', ['TableHelper', "dateTimeFactory",function(TableHelper,dateTimeFactory) {
        return function(text, param) {
            if (text === null || text === "") {
                text = "-";
            }
            if (param.transValue) {
                var transValue;
                if (angular.isFunction(param.transValue)) {
                    var tempObject = param.transValue();
                    var transObject = {};
                    var map = tempObject.list;
                    var key = tempObject.key;
                    var value = tempObject.value;
                    for (var i = 0; i < map.length; i++) {
                        transObject[map[i][key]] = map[i][value];
                    }
                    transValue = transObject[text];
                } else {
                    transValue = param.transValue[text];
                }
                text = transValue || "-";
            }
            if (param.formatDate) {
                try {
                    text = dateTimeFactory.format(dateTimeFactory.newDate(text), param.formatDate);
                } catch (err) {

                }
            }
            return text;
        };
    }])
    .directive('angularTable', function() {
        return {
            restrict: 'EA',
            scope: {
                tableParams: '='
            },
            replace: true,
            template: '<div class="table-responsive table-wrapper">' +
                ' <angular-table-body table-list="tableParams.tableList" table-settings="tableParams.tableSettings" table-options="tableParams.tableOptions">' +
                ' </angular-table-body>' +
                '<div class="resize-bar"></div>' +
                /*'<div class="loading-wrap" ng-show="tableLoading"><p class="inner"><i class="icon-spinner icon-spin"></i>正在加载，请稍等...</p></div>' +*/
                '</div>',
            link: function(scope, element, attr) {
            }
        };
    })
    .directive('angularTableBody', ['TableHelper', '$document', '$timeout', function(TableHelper, $document, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                tableList: '=',
                tableSettings: '=',
                tableOptions: '='
            },
            template: '<table class="table table-bordered table-hover table-striped">' +
                '    <thead class="table-header">' +
                '       <tr>' +
                '           <th class="th-checkbox" ng-if="::tableSettings.checkbox"><input type="checkbox" ng-click="checkAll()" ng-checked="isCheckAll" /></th>' +
                '           <th class="th-unit" data-th-key="{{::key}}" ng-if="!item.hidden" ng-repeat="(key,item) in tableOptions" ng-style="{\'width\':item.width}" ng-class="{\'sort\':key===col}">' +
                '              <span class="inner" ng-click="sort(key)"><span class="table-sort"  ng-class="{true:\'down\', false: \'up\'}[desc]"><span class="icon-caret-up"></span><span class="icon-caret-down"></span></span>' +
                '              <span class="th-inner" ng-bind="::item.ChineseName"></span></span>' +
                '              <span class="th-resize" ng-mousedown="mousedown(key,$event)"></span>' +
                '           </th>' +
                '       </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '    <tr class="table-row" ng-class="{\'selected\':tr.checked}" ng-repeat="tr in tableList|orderBy:col:desc">' +
                '         <td class="td-checkbox" ng-if="::tableSettings.checkbox"><input type="checkbox" ng-model="tr.checked" ng-change="checkItem(tr)" /></td>' +
                '         <td data-td-key="{{::key}}" class="td-unit" ng-repeat="(key,td) in tr" ng-if="::tableOptions[key] && !tableOptions[key].hidden">' +
                '              <div ng-if="::tableOptions[key].cellTemplate" td-compile="::td" class="td-inner"></div>' +
                '              <div ng-if="::!tableOptions[key].cellTemplate" ng-bind="::td|tdTrans:tableOptions[key]" title="{{::td|tdTrans:tableOptions[key]}}" class="td-inner td-text"></div>' +
                '         </td>' +
                '     </tr>' +
                '    </tbody>' +
                ' </table>',
            link: function(scope, element, attr) {
                scope.gridScope = scope.$parent.$parent;
                /*排序*/
                scope.col = '';
                scope.desc = '';
                scope.sort = function(key) {
                    scope.col = key;
                    scope.desc = !scope.desc;
                }
                /*拖拽*/
                var resizeKey;
                var $resizeTh;
                var $tableWrapper = $(element).parent();
                var $resizeBar = $tableWrapper.find('.resize-bar');
                scope.mousedown = function(key, event) {
                    event.stopPropagation();
                    event.preventDefault();
                    resizeKey = key;
                    $resizeTh = $(event.target).parent();
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    $resizeBar.css({
                        left: event.pageX - $tableWrapper.offset().left + $tableWrapper.scrollLeft()
                    });
                };

                function mousemove(event) {
                    event.stopPropagation();
                    var x = event.pageX;
                    $resizeBar.css({
                        left: x - $tableWrapper.offset().left + $tableWrapper.scrollLeft()
                    });
                }

                function mouseup(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var currentWidth = parseInt($resizeBar.offset().left) - $resizeTh.offset().left;
                    var resizeNextItemFlag = false;
                    var currentMinWidth = $resizeTh.find('.inner').outerWidth() + 10;
                    var currentWidth = currentWidth < currentMinWidth ? currentMinWidth : currentWidth;
                    angular.forEach(scope.tableOptions, function(item, key) {
                        if (resizeNextItemFlag) {
                            var nextTh = $tableWrapper.find("[data-th-key='" + key + "']").find('.inner');
                            if (item.cellTemplate) {
                                var nextTd = $tableWrapper.find("[data-td-key='" + key + "']").find('.td-inner');
                                var innerWidth = 0;
                                nextTd.each(function() {
                                    innerWidth = Math.max($(this).outerWidth(), innerWidth);
                                });
                                var nextMinWidth = Math.max(innerWidth + 16, nextTh.outerWidth()+10);
                            } else {
                                var nextMinWidth = nextTh.outerWidth()+10;
                            }
                            var nextItemWidth = parseInt(scope.tableOptions[key].width) + parseInt(scope.tableOptions[resizeKey].width) - currentWidth;
                            scope.tableOptions[key].width = Math.max(nextItemWidth, nextMinWidth);
                            resizeNextItemFlag = false;
                        }
                        if (key === resizeKey && !resizeNextItemFlag) {
                            resizeNextItemFlag = true;
                        }
                    });
                    scope.tableOptions[resizeKey].width = currentWidth;
                    scope.$apply();
                    $resizeBar.css({
                        left: -999999999
                    });
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
                var tableOptionsRecord;
                var throttled = TableHelper.throttled(function() {
                    fixedTdWidth();
                    scope.$apply();
                }, 500);
                $(window).resize(throttled);
                $(window).on('window-resize', throttled);
                scope.$watch('tableList', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        tableOptionsRecord = angular.copy(scope.tableOptions);
                        $timeout(function() {
                            fixedTdWidth();
                        }, 0);
                        scope.isCheckAll = false;
                    }
                });

                function fixedTdWidth() {
                    var minWidth = 120;
                    var autoWidthIndex = 0;
                    var hasDefinedWidth = scope.tableSettings && scope.tableSettings.checkbox ? 40 : 0;
                    /*如果有设置checkbox，这需要计算占用的宽度*/
                    var $elementParent = $(element).parent(".table-wrapper");
                    var wrapperWidth = $elementParent.width() - 2;
                    /*统计自动宽度的数量*/
                    angular.forEach(tableOptionsRecord, function(item, key) {
                        if (!scope.tableOptions[key].hidden) {
                            if (item.width !== "auto") {
                                hasDefinedWidth += parseInt(scope.tableOptions[key].width);
                            } else if (angular.isFunction(item.cellTemplate)) {
                                /*按钮单元格宽度自适应*/
                                var $tdInner = $tableWrapper.find("[data-td-key='" + key + "']").find('.td-inner');
                                var $thInner = $tableWrapper.find("[data-th-key='" + key + "']").find('.th-inner');
                                var innerWidth = 0;
                                $tdInner.addClass("inline-block").each(function() {
                                    innerWidth = Math.max($(this).outerWidth(), innerWidth);
                                });
                                scope.tableOptions[key].width = Math.max(innerWidth + 16, $thInner.outerWidth());
                                hasDefinedWidth += scope.tableOptions[key].width;
                            } else {
                                autoWidthIndex++;
                            }
                        }
                    });
                    if (autoWidthIndex === 0 && scope.tableList && scope.tableList.length > 0) {
                        throw "warning:表格至少需要一个宽度为auto的非html单元格";
                    }
                    angular.forEach(tableOptionsRecord, function(item, key) {
                        if (!scope.tableOptions[key].hidden && item.width === "auto" && autoWidthIndex > 0 && !item.cellTemplate) {
                            var everyAutoWidth = (wrapperWidth - hasDefinedWidth) / autoWidthIndex;
                            scope.tableOptions[key].width = Math.max(everyAutoWidth, minWidth);
                        }
                    });
                }
                /*勾选表格单元格*/
                scope.checkItem = function(item) {
                    var isAllChecked = true;
                    angular.forEach(scope.tableList, function(item) {
                        if (!item.checked) {
                            isAllChecked = false;
                        }
                    });
                    if (isAllChecked) {
                        scope.isCheckAll = true;
                    } else {
                        scope.isCheckAll = false;
                    }
                };
                /*
                勾选全部
                 */
                scope.checkAll = function() {
                    var isAllChecked = true;
                    angular.forEach(scope.tableList, function(item) {
                        if (!item.checked) {
                            isAllChecked = false;
                        }
                    });
                    angular.forEach(scope.tableList, function(item) {
                        if (!isAllChecked) {
                            item.checked = true;
                            scope.isCheckAll = true;
                        } else {
                            item.checked = false;
                            scope.isCheckAll = false;
                        }
                    });
                }
            }
        };
    }])
    .directive('tdCompile', ['$compile', function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.tdCompile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);
