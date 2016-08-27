angular.module('ui.grid', ["ngDatetime"]);
angular.module('ui.grid').factory('TableFactory', ['$rootScope',function($rootScope) {
    var Table = {};
    Table.defaultSettings = {
        checkbox: false,
        viewportNumbers: 10
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
}])

angular.module('ui.grid').factory('TableHelper', [function() {
    var Helper = {};
    Helper.sort = function(list,key, t, fix) {
        if (!list.length) {
            return list;
        }
        t = t === 'desc' ? 'desc' : 'asc'; // ascending or descending sorting, 默认 升序
        fix = Object.prototype.toString.apply(fix) === '[object Function]' ? fix : function(key) {
            return key;
        };
        switch (Object.prototype.toString.apply(fix.call({}, list[0][key]))) {
            case '[object Number]':
                return list.sort(function(a, b) {
                    return t === 'asc' ? (fix.call({}, a[key]) - fix.call({}, b[key])) : (fix.call({}, b[key]) - fix.call({}, a[key])); });
            case '[object String]':
                return list.sort(function(a, b) {
                    return t === 'asc' ? fix.call({}, a[key]).localeCompare(fix.call({}, b[key])) : fix.call({}, b[key]).localeCompare(fix.call({}, a[key]));
                });
            default:
                return list;
        }
    }
    Helper.throttle = function(method, delay) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                method.apply(context, args);
            }, delay);
        }
    };
    Helper.getScrollbarWidth = function() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };
    return Helper;
}])

angular.module('ui.grid').directive('angularTableBody', ['$document', '$timeout', 'TableHelper', '$rootScope', function($document, $timeout, TableHelper, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<tbody>' +
            '   <tr ng-class="{selected:tr.checked}" class="table-row" tr="tr" key="key" table-list="tableList" tr-index="{{$index}}" table-settings="tableSettings" table-options="tableOptions" select-row="selectRow(tr,$index)" angular-table-row ng-repeat="tr in viewportList">' +
            '   </tr>' +
            '</tbody>',
        link: function(scope, element, attr) {
            /*选中表格行*/
            scope.selectRow = function(item, index) {
                var selectAll = true;
                for (var i = 0; i < scope.viewportList.length; i++) {
                    if (!scope.viewportList[i].checked) {
                        selectAll = false;
                        break;
                    }
                }
                scope.selectAll = selectAll;
            };
        }
    };
}])

angular.module('ui.grid').directive('tableCellCompile', ['$compile', function($compile) {
    return function(scope, element, attrs) {
        scope.$watch(function(scope) {
            return scope.$eval(attrs.tableCellCompile);
        }, function(value) {
            element.html(value);
            $compile(element.contents())(scope);
        });
    };
}]);

angular.module('ui.grid').directive('angularTableContent', ['TableHelper', '$rootScope', '$timeout', function(TableHelper, $rootScope, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            tableList: '=',
            tableSettings: '=',
            tableOptions: '='
        },
        replace: true,
        template: '<div>' +
            '   <div class="table-header-wrapper">' +
            '       <table class="table table-bordered table-hover table-striped">' +
            '           <thead class="table-header" angular-table-header></thead>' +
            '       </table>' +
            '   </div>' +
            '   <div class="table-body-wrapper">' +
            '       <div class="table-body-inner" ng-show="tableList.length">' +
            '           <table class="table table-bordered table-hover table-striped">' +
            '               <tbody class="table-body" angular-table-body></tbody>' +
            '           </table>' +
            '       </div>' +
            '       <div class="table-body-empty" ng-show="tableList.length === 0">' +
            '           <div class="table-body-empty-text">' +
            '              <span class="icon icon-exclamation-sign"></span>' +
            '              <span class="text" ng-bind="::tableSettings.emptyPlaceholder"></span>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>',
        link: function(scope, element, attr) {
            scope.gridScope = scope.$parent.$parent;
            var tableBodyHeight;
            var $wrapper = $(element).closest('.table-wrapper');
            var $tableHeaderWrapper = $(element).find('.table-header-wrapper');
            var $tableBodyWrapper = $(element).find('.table-body-wrapper');
            var $tableBodyInner = $tableBodyWrapper.find('.table-body-inner');
            var scrollbarWidth = TableHelper.getScrollbarWidth();
            var rowHeight = 40; //每行的高度
            var minCellWidth = 120; //单元格最小
            var viewportNumbers = scope.tableSettings.viewportNumbers; //可视区域的数据条数
            var isHasScrollbar = false;
            var isFixedLastKeyWidth = false; //调整最后一个key的宽度
            /**
             * 同步表头和表体的横向滚动条
             */
            var syncScrollLeft = function() {
                var recordScrollLeft = 0;
                var timeoutId = setTimeout(function() {
                    $tableBodyWrapper.css('left', 0).scrollLeft(0);
                    clearTimeout(timeoutId);
                }, 0);
                $wrapper.scrollLeft(0).on('scroll', function(event) {
                    var scrollLeft = $(this).scrollLeft();
                    if (recordScrollLeft !== scrollLeft) {
                        $tableBodyWrapper.css('left', scrollLeft);
                        $tableBodyWrapper.scrollLeft(scrollLeft);
                        recordScrollLeft = scrollLeft;
                    }
                });
            };
            /**
             * 滚动加载
             */
            var renderViewportRows = scope.renderViewportRows = function(scrollTopParam) {
                var scrollTop = typeof scrollTopParam === "undefined" ? $tableBodyWrapper.scrollTop() : scrollTopParam;
                var tableListHeight = scope.tableList.length * rowHeight;
                isHasScrollbar = tableBodyHeight < tableListHeight;
                $tableHeaderWrapper.css("padding-right", isHasScrollbar ? scrollbarWidth : 0);
                $tableBodyWrapper.css({
                    "overflow-y": isHasScrollbar ? "auto" : "hidden",
                    "height": viewportNumbers * rowHeight
                });
                if (!isHasScrollbar) {
                    $tableBodyWrapper.scrollTop(0);
                }
                $tableBodyInner.css({
                    "padding-top": scrollTop,
                    "height": tableListHeight
                });
                var startItemNumber = Math.round(scrollTop / rowHeight);
                scope.viewportList = scope.tableList.slice(startItemNumber, startItemNumber + viewportNumbers);
            };
            /**
             * 重新渲染
             */
            var resetLayoutViewport = function() {
                rowHeight = $tableBodyWrapper.find('.table-row').outerHeight();
                tableBodyHeight = viewportNumbers * rowHeight;
                isHasScrollbar = tableBodyHeight < scope.tableList.length * rowHeight;
                syncScrollLeft();
                renderViewportRows(0);
                resizeCellWidth();
            };
            /**
             * 初始化渲染
             */
            var render = function() {
                var recordScrollTop = 0;
                scope.viewportList = scope.tableList.slice(0, viewportNumbers);
                $tableBodyWrapper.on('scroll', function() {
                    var scrollTop = $(this).scrollTop();
                    var maxPaddingTop = (scope.tableList.length - scope.viewportList.length) * rowHeight;
                    if (recordScrollTop !== scrollTop) {
                        renderViewportRows(Math.min(scrollTop, maxPaddingTop));
                        recordScrollTop = Math.min(scrollTop, maxPaddingTop);
                        scope.$digest();
                    }
                });
                $timeout(resetLayoutViewport, 0);
            };
            scope.$watch('$parent.tableParams._watcherId', function(newValue, oldValue) {
                if (newValue !== oldValue || typeof newValue !== "undefined") {
                    render();
                }
            });

            /*调整表格宽度*/
            var resizeThrottled = TableHelper.throttle(function() {
                resizeCellWidth();
                scope.$digest();
            }, 50);
            $(window).resize(resizeThrottled);
            $(window).on('window-resize', resizeThrottled);
            var resizeCellWidth = scope.resizeCellWidth = function() {
                /**
                 * 修正滚动条位置
                 */
                var wrapperScrollLeft = $wrapper.scrollLeft();
                if ($tableBodyWrapper.scrollLeft() !== wrapperScrollLeft) {
                    $wrapper.scrollLeft(wrapperScrollLeft - scrollbarWidth);
                }

                var tableOptionsRecord = angular.copy(scope.tableOptions);
                var autoWidthNumber = 0;
                /**
                 * 如果有设置checkbox，这需要计算占用的宽度
                 */
                var hasDefinedWidth = scope.tableSettings && scope.tableSettings.checkbox ? 40 : 0;
                var wrapperWidth = isHasScrollbar ? $wrapper.width() - scrollbarWidth - 2 : $wrapper.width() - 2;

                /**
                 * 调整有宽度数字的单元格
                 */
                var handlderHasWidth = function(key) {
                    scope.tableOptions[key].width = Math.max(scope.tableOptions[key].width, minCellWidth, $wrapper.find("[data-th-key='" + key + "']").find('.inner').outerWidth() + 10);
                    hasDefinedWidth += parseInt(scope.tableOptions[key].width);
                };
                /**
                 * 调整自适应且是HTML模版的单元格
                 */
                var hanlderAutoWidthCellTemplate = function(key) {
                    var $thInner = $wrapper.find("[data-th-key='" + key + "']").find('.th-inner');
                    var $tdInner = $wrapper.find("[data-td-key='" + key + "']").find('.td-inner');
                    var innerWidth = 0;
                    $tdInner.each(function() {
                        innerWidth = Math.max($(this).outerWidth(true), innerWidth);
                    });
                    scope.tableOptions[key].width = Math.max(innerWidth + 16, $thInner.outerWidth(), 80, tableOptionsRecord[key].minWidth || 0);
                    hasDefinedWidth += parseInt(scope.tableOptions[key].width);
                };
                /**
                 * 处理自动宽度的数量
                 */
                angular.forEach(tableOptionsRecord, function(item, key) {
                    if (!scope.tableOptions[key].hidden) {
                        if (tableOptionsRecord[key].width !== "auto") {
                            handlderHasWidth(key);
                        } else if (tableOptionsRecord[key].cellTemplate) {
                            hanlderAutoWidthCellTemplate(key);
                        } else {
                            autoWidthNumber++;
                        }
                    }
                });
                /**
                 * 不存在自动宽度的非HTML模版的单元格
                 */
                var noExistAutoWidthNumber = function() {
                    for (var key in tableOptionsRecord) {
                        if (!scope.tableOptions[key].hidden && !tableOptionsRecord[key].cellTemplate) {
                            scope.tableOptions[key].width = Math.max(wrapperWidth - (hasDefinedWidth - scope.tableOptions[key].width), minCellWidth, tableOptionsRecord[key].minWidth || 0);
                            break;
                        }
                    }
                };
                /**
                 * 存在自动宽度的非HTML模版的单元格
                 */
                var existAutoWidthNumber = function() {
                    for (var key in tableOptionsRecord) {
                        if (!scope.tableOptions[key].hidden && tableOptionsRecord[key].width === "auto" && !tableOptionsRecord[key].cellTemplate) {
                            var autoWidthAverage = (wrapperWidth - hasDefinedWidth) / autoWidthNumber;
                            scope.tableOptions[key].width = Math.max(autoWidthAverage, minCellWidth, tableOptionsRecord[key].minWidth || 0);
                        }
                    }
                };
                autoWidthNumber === 0 ? noExistAutoWidthNumber() : existAutoWidthNumber();
            }
        }
    };
}])

angular.module('ui.grid')
    .directive('angularTableHeader', ['$document', 'TableHelper', function($document, TableHelper) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<thead>' +
                '   <tr>' +
                '      <th class="th-checkbox" ng-show="::tableSettings.checkbox"><label><input type="checkbox" ng-model="selectAll" ng-change="checkAll()" /></label></th>' +
                '      <th class="th-unit" data-th-key="{{::key}}" ng-if="!item.hidden" ng-repeat="(key,item) in tableOptions" ng-style="{\'width\':item.width}" ng-class="{\'sort\':key===col}">' +
                '          <span class="inner" ng-click="sort(key)"><span class="table-sort" ng-class="{true:\'down\', false: \'up\'}[desc]"><span class="icon-caret-up"></span><span class="icon-caret-down"></span></span>' +
                '          <span class="th-inner" ng-bind="::item.ChineseName"></span></span>' +
                '          <span class="th-resize" ng-mousedown="mousedown(key,$event)"></span>' +
                '      </th>' +
                '   </tr>' +
                '</thead>',
            link: function(scope, element, attr) {
                /*排序*/
                scope.col = '';
                var sortType = "asc";
                scope.sort = function(key) {
                    sortType = sortType === "asc" ? "desc" : "asc";
                    scope.tableList = TableHelper.sort(scope.tableList, key, sortType);
                    scope.col = key;
                    scope.renderViewportRows(0);
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
                        var currentWidth = Math.max(currentWidth, currentMinWidth);

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
                    angular.forEach(scope.tableList, function(item, index) {
                        item.checked = scope.selectAll;
                    });
                }
            }
        };
    }])

angular.module('ui.grid').directive('angularTableRow', ['$document', '$compile', '$timeout', function($document, $compile, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            tr: "=",
            key: "=",
            tableSettings: "=",
            tableOptions: "=",
            selectRow: "&",
            tableList: "=",
            trIndex: "@"
        },
        link: function(scope, element, attr) {
            scope.gridScope = scope.$parent.gridScope;
            scope.$rowScope = scope;
            var parentScope = scope.$parent;
            var expandedContent;
            var render = function() {
                if (expandedContent) {
                    expandedContent.scope().$destroy();
                }
                var template = '<td class="td-checkbox" ng-show="::tableSettings.checkbox"><label><input type="checkbox" ng-model="tr.checked" ng-change="selectRow({tr:tr})" /></label></td>' +
                    '<td data-td-key="{{::key}}" class="td-unit" ng-repeat="(key,td) in tr" ng-if="::tableOptions[key] && !tableOptions[key].hidden" ng-style="{\'width\':tableOptions[key].width}">' +
                    '   <div ng-if="::tableOptions[key].cellTemplate" table-cell-compile="::td" class="td-inner td-tpl"></div>' +
                    '   <div ng-if="::!tableOptions[key].cellTemplate" ng-bind="::td|tableCellTrans:tableOptions[key]" title="{{::td|tableCellTrans:tableOptions[key]}}" class="td-inner td-text"></div>' +
                    '</td>';
                var rowTemplate = angular.element(template);
                expandedContent = $compile(rowTemplate)(scope.$new());
                element.html(rowTemplate);
            };
            render();
            var getCurrentRowIndex = function() {
                for (var i = 0; i < scope.tableList.length; i++) {
                    if (scope.tableList[i].$$hashKey === scope.tr.$$hashKey) {
                        return i;
                        break;
                    }
                }
            }
            scope.refresh = function() {
                scope.tableList.splice(getCurrentRowIndex(), 1, angular.copy(scope.tr));
                parentScope.renderViewportRows();
                parentScope.resizeCellWidth();
            };
            scope.remove = function() {
                scope.tableList.splice(getCurrentRowIndex(), 1);
                scope.$destroy();
                parentScope.renderViewportRows();
                parentScope.resizeCellWidth();
            };
        }
    }
}])

angular.module('ui.grid').directive('angularTable', function() {
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
            '</div>',
        link: function(scope, element, attr) {

        }
    };
})

angular.module('ui.grid').filter('tableCellTrans', ["dateTimeFactory", function(dateTimeFactory) {
    return function(text, param) {
        var isNull = text === null || text === "";
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
                text = "-";
            }
        }
        if (param.toFixed) {
            try {
                if (angular.isNumber(Number(text)) && !angular.equals(NaN, Number(text))) {
                    text = Number(text).toFixed(param.toFixed);
                } else {
                    text = "-";
                }

            } catch (err) {
                console.log(err);
            }
        }
        if (param.unitText) {
            text = text + param.unitText.toString();
        }
        return isNull ? "-" : text;
    };
}])
