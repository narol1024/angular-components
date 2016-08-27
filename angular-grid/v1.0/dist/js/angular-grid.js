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
    .factory('TableFactory', ['$http', 'TableHelper', '$rootScope', '$timeout', function($http, TableHelper, $rootScope, $timeout) {
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
            $timeout(function() {
                $rootScope.$broadcast("$angularTableCompleteEvent");
            }, 0);
            return result;
        };
        Table.ready = function(tableOptions) {
            $timeout(function() {
                $rootScope.$broadcast("$angularTableReadyEvent");
            }, 0);
        };
        return Table;
    }])
    .filter('tdTrans', ['TableHelper', "dateTimeFactory", function(TableHelper, dateTimeFactory) {
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
                '   <angular-table-content table-list="tableParams.tableList" table-settings="tableParams.tableSettings" table-options="tableParams.tableOptions">' +
                '   </angular-table-content>' +
                '   <div class="resize-bar"></div>' +
                '<div class="loading-wrap" ng-show="tableLoading"><p class="inner"><i class="icon-spinner icon-spin"></i>正在加载数据...</p></div>' +
                '</div>',
            link: function(scope, element, attr) {
                scope.$on("$angularTableReadyEvent", function($event, tableOptions) {
                    scope.tableLoading = true;
                });
            }
        };
    })
    .directive('angularTableContent', ['TableHelper', '$document', '$timeout', function(TableHelper, $document, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                tableList: '=',
                tableSettings: '=',
                tableOptions: '='
            },
            replace: true,
            template: '<table class="table table-bordered table-hover table-striped">' +
                '    <thead angular-table-header table-settings="tableSettings" table-options="tableOptions" table-list="tableList"></thead>' +
                '    <tbody><tr angular-table-row table-settings="tableSettings" table-options="tableOptions" table-list="tableList"></tr></tbody>' +
                '</table>',
            link: function(scope, element, attr) {
                scope.gridScope = scope.$parent.$parent;
            }
        };
    }])
    .directive('angularTableHeader', ['$document', function($document) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<thead class="table-header">' +
                '   <tr>' +
                '      <th class="th-checkbox" ng-show="::tableSettings.checkbox"><label><input type="checkbox" ng-model="selectAll" ng-change="checkAll()" /></label></th>' +
                '      <th class="th-unit" data-th-key="{{::key}}" ng-if="!item.hidden" ng-repeat="(key,item) in tableOptions" ng-style="{\'width\':item.width}" ng-class="{\'sort\':key===col}">' +
                '          <span class="inner" ng-click="sort(key)"><span class="table-sort"  ng-class="{true:\'down\', false: \'up\'}[desc]"><span class="icon-caret-up"></span><span class="icon-caret-down"></span></span>' +
                '          <span class="th-inner" ng-bind="::item.ChineseName"></span></span>' +
                '          <span class="th-resize" ng-mousedown="mousedown(key,$event)"></span>' +
                '      </th>' +
                '   </tr>' +
                '</thead>',
            link: function(scope, element, attr) {
                /*排序*/
                scope.col = '';
                scope.desc = '';
                scope.sort = function(key) {
                    scope.col = key;
                    scope.desc = !scope.desc;
                };
                /*拖拽*/
                var $tableWrapper = $(element).closest('.table-wrapper');
                scope.mousedown = function(key, event) {
                    event.preventDefault();
                    var resizeKey = key;
                    var tableWrapperOffset = $tableWrapper.offset();
                    var tableWrapperScrollLeft = $tableWrapper.scrollLeft();
                    var $resizeTh = $(event.target).parent();
                    var $resizeBar = $tableWrapper.find('.resize-bar');
                    var pageX = event.pageX;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    $resizeBar.css({
                        left: event.pageX - tableWrapperOffset.left + tableWrapperScrollLeft
                    });

                    function mousemove(event) {
                        $resizeBar.css({
                            left: event.pageX - tableWrapperOffset.left + tableWrapperScrollLeft
                        });
                    }

                    function mouseup(event) {
                        var targetX = event.pageX;
                        var currentWidth = parseInt($resizeBar.offset().left) - $resizeTh.offset().left;
                        var resizeNextItemFlag = false;
                        var currentMinWidth = $resizeTh.find('.inner').outerWidth() + 10;
                        var currentWidth = currentWidth < currentMinWidth ? currentMinWidth : currentWidth;

                        /*调整下一个key的宽度*/
                        var $nextTh = $resizeTh.next();
                        var nextKey = $nextTh.data("th-key");
                        var nextItem = scope.tableOptions[nextKey];
                        var $nextThInner = $nextTh.find('.inner');
                        if (nextItem.cellTemplate) {
                            var $nextTdInner = $tableWrapper.find("[data-td-key='" + nextKey + "']").find('.td-inner');
                            var innerWidth = 0;
                            $nextTdInner.each(function() {
                                innerWidth = Math.max($(this).outerWidth(), innerWidth);
                            });
                            var nextMinWidth = Math.max(innerWidth + 16, $nextThInner.outerWidth() + 10);
                        } else {
                            var nextMinWidth = $nextThInner.outerWidth() + 10;
                        }
                        var nextItemWidth = parseInt(scope.tableOptions[nextKey].width) + parseInt(scope.tableOptions[resizeKey].width) - currentWidth;
                        scope.tableOptions[nextKey].width = Math.max(nextItemWidth, nextMinWidth);
                        scope.tableOptions[resizeKey].width = currentWidth;
                        scope.$apply();
                        $resizeBar.css({
                            left: -999999999
                        });
                        $document.unbind('mousemove', mousemove);
                        $document.unbind('mouseup', mouseup);
                    }
                };
                scope.checkAll = function() {
                    angular.forEach(scope.tableList, function(item) {
                        item.checked = scope.selectAll;
                    });
                }
            }
        };
    }])
    .directive('angularTableRow', ['$document', '$timeout', 'TableHelper', '$rootScope', function($document, $timeout, TableHelper, $rootScope) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<tr class="table-row"  ng-repeat="tr in tableList|orderBy:col:desc">' +
                '    <td class="td-checkbox" ng-show="::tableSettings.checkbox"><label><input type="checkbox" ng-model="tr.checked" ng-change="selectRow(tr,$index)" /></label></td>' +
                '    <td data-td-key="{{::key}}" class="td-unit" ng-repeat="(key,td) in tr" ng-if="::tableOptions[key] && !tableOptions[key].hidden">' +
                '        <div ng-if="::tableOptions[key].cellTemplate" td-compile="::td" class="td-inner"></div>' +
                '        <div ng-if="::!tableOptions[key].cellTemplate" ng-bind="::td|tdTrans:tableOptions[key]" title="{{::td|tdTrans:tableOptions[key]}}" class="td-inner td-text"></div>' +
                '    </td>' +
                '</tr>',
            link: function(scope, element, attr) {
                var $tableWrapper = $(element).closest(".table-wrapper");
                /*选中表格行*/
                scope.selectRow = function(item, index) {
                    var selectAll = true;
                    for (var i = 0; i < scope.tableList.length; i++) {
                        if (!scope.tableList[i].checked) {
                            selectAll = false;
                            break;
                        }
                    }
                    scope.selectAll = selectAll;
                    /*用DOM操作class，减少watcher的数量*/
                    var $currentRow = $tableWrapper.find("tbody tr").eq(index);
                    $currentRow.toggleClass("selected", item.checked);
                };
                /*调整表格宽度*/
                var tableOptionsRecord;
                var throttled = TableHelper.throttled(function() {
                    resizeUnitWidth();
                    scope.$apply();
                }, 500);
                $(window).resize(throttled);
                $(window).on('window-resize', throttled);
                scope.$on('$angularTableCompleteEvent', function() {
                    $timeout(function() {
                        tableOptionsRecord = angular.copy(scope.tableOptions);
                        resizeUnitWidth();
                        scope.$parent.tableLoading = false;
                    }, 0);
                });

                function resizeUnitWidth() {
                    var minWidth = 120;
                    var autoWidthNumber = 0;
                    /*如果有设置checkbox，这需要计算占用的宽度*/
                    var hasDefinedWidth = scope.tableSettings && scope.tableSettings.checkbox ? 40 : 0;
                    var wrapperWidth = $tableWrapper.width() - 2;
                    /*统计自动宽度的数量*/
                    angular.forEach(tableOptionsRecord, function(item, key) {
                        if (!scope.tableOptions[key].hidden) {
                            if (item.width !== "auto") {
                                if (item.cellTemplate) {
                                    var $thInner = $tableWrapper.find("[data-th-key='" + key + "']").find('.th-inner');
                                    var $tdInner = $tableWrapper.find("[data-td-key='" + key + "']").find('.td-inner');
                                    var innerWidth = 0;
                                    $tdInner.addClass("inline-block").each(function() {
                                        innerWidth = Math.max($(this).outerWidth(), innerWidth);
                                    }).removeClass("inline-block");
                                    scope.tableOptions[key].width = Math.max(innerWidth + 16, $thInner.outerWidth());
                                }
                                hasDefinedWidth += parseInt(scope.tableOptions[key].width);
                            } else {
                                autoWidthNumber++;
                            }
                        }
                    });
                    if (autoWidthNumber === 0 && console && console.warn) {
                        console.warn("angular.grid:建议表格设置一个宽度为自动的单元格");
                    }
                    angular.forEach(tableOptionsRecord, function(item, key) {
                        if (!scope.tableOptions[key].hidden && item.width === "auto" && autoWidthNumber > 0) {
                            var autoWidthAverage = (wrapperWidth - hasDefinedWidth) / autoWidthNumber;
                            scope.tableOptions[key].width = Math.max(autoWidthAverage, minWidth, item.minWidth || 0);
                        }
                    });
                }
            }
        };
    }])
    .directive('tdCompile', ['$compile', function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(function(scope) {
                return scope.$eval(attrs.tdCompile);
            }, function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            });
        };
    }]);
