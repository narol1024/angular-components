angular.module('ui.grid', []);
angular.module('ui.grid').directive('angularTableBody', [function() {
    return {
        restrict: 'EA',
        replace: true,
        template: '<tbody>' +
            '   <tr angular-table-row ng-class="{selected:tr.checked}" class="table-row" tr="tr" key="key" table-list="tableList" table-settings="tableSettings" table-options="tableOptions" select-row="selectRow(tr,$index)" ng-repeat="tr in viewportList">' +
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
}]);

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

angular.module('ui.grid').directive('angularTableContent', ['TableHelper', '$timeout', function(TableHelper, $timeout) {
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
            '           <strong class="text" ng-bind="::tableSettings.emptyPlaceholder"></strong>' +
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
                isHasScrollbar = tableBodyHeight < scope.tableList.length * rowHeight;
                $tableHeaderWrapper.css("padding-right", isHasScrollbar ? scrollbarWidth : 0);
                if (!isHasScrollbar || scrollTopParam === 0) {
                    $tableBodyWrapper.scrollTop(0);
                }
                $tableBodyWrapper.css({
                    "overflow-y": isHasScrollbar ? "auto" : "hidden"
                });
                $tableBodyInner.css({
                    "padding-top": scrollTop
                });
                var startItemNumber = Math.round(scrollTop / rowHeight);
                scope.viewportList = scope.tableList.slice(startItemNumber, startItemNumber + viewportNumbers);
                scope.$applyAsync();
            };
            /**
             * 重新渲染
             */
            var resetLayoutViewport = function() {
                rowHeight = $tableBodyWrapper.find('.table-row').outerHeight();
                tableBodyHeight = viewportNumbers * rowHeight;
                isHasScrollbar = tableBodyHeight < scope.tableList.length * rowHeight;
                $tableBodyWrapper.css({
                    "height": scope.tableList.length > 0 ? viewportNumbers * rowHeight : scope.tableSettings._emptyBodyHeight
                });
                $tableBodyInner.css({
                    "height": scope.tableList.length > 0 ? scope.tableList.length * rowHeight : scope.tableSettings._emptyBodyHeight
                });
                syncScrollLeft();
                renderViewportRows(0);
                resizeCellWidth();
            };
            
            /**
             * 初始化渲染
             */
            var render = function() {
                var renderTimer = null;
                scope.viewportList = scope.tableList.slice(0, viewportNumbers);
                $tableBodyWrapper.on('scroll', function() {
                    var _this = this;
                    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                    var renderFrame = function() {
                        var scrollTop = $(_this).scrollTop();
                        var viewportHeight = scope.viewportList.length * rowHeight;
                        var tableListHeight = scope.tableList.length * rowHeight;
                        var isScrollBottom = scrollTop + viewportHeight < tableListHeight;
                        if (isScrollBottom) {
                            renderViewportRows(scrollTop);
                        } else {
                            renderViewportRows(tableListHeight - viewportHeight);
                        }
                    };
                    window.requestAnimationFrame ? requestAnimationFrame(renderFrame) : renderFrame();
                });

                $timeout(resetLayoutViewport, 0);
            };
            scope.$watch('$parent.tableOptions._watcherId', function(newValue, oldValue) {
                if (newValue !== oldValue || typeof newValue !== "undefined") {
                    render();
                }
            });

            /*调整表格宽度*/
            var resizeThrottled = TableHelper.throttle(function() {
                resizeCellWidth();
                scope.$applyAsync();
            }, 50);
            $(window).resize(resizeThrottled);
            $(window).on('window-resize', resizeThrottled);
            var resizeCellWidth = scope.resizeCellWidth = function() {
                /**
                 * 修正滚动条位置
                 */
                var updatedWindow = $(window).width();
                var wrapperScrollLeft = $wrapper.scrollLeft();
                var tableScrollLeft = $tableBodyWrapper.scrollLeft();
                if ($tableBodyWrapper.scrollLeft() !== wrapperScrollLeft) {
                    $wrapper.scrollLeft(tableScrollLeft);
                    $tableBodyWrapper.scrollLeft(tableScrollLeft);
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
}]);

angular.module('ui.grid')
    .directive('angularTableHeader', ['$document',
        'TableHelper',
        function($document, TableHelper) {
            return {
                restrict: 'EA',
                replace: true,
                template: '<thead>' +
                    '   <tr>' +
                    '      <th class="th-checkbox" ng-show="::tableSettings.checkbox"><label><input type="checkbox" ng-model="selectAll" ng-change="checkAll()" /></label></th>' +
                    '      <th class="th-unit" data-th-key="{{::key}}" ng-if="!item.hidden" ng-repeat="key in objectKeys(tableOptions)" ng-init="item=tableOptions[key]" ng-style="{\'width\':item.width}" ng-class="{\'sort\':key===col}">' +
                    '          <div class="relative">' +
                    '             <span class="inner" ng-click="sort(key)">' +
                    '               <span class="table-sort" ng-class="{asc:\'down\', desc: \'up\'}[sortType]">' +
                    '                  <span class="icon-up"></span>' +
                    '<span class="icon-down"></span>' +
                    '</span>' +
                    '               <span class="th-inner" ng-bind="::item.ChineseName"></span>' +
                    '          </span>' +
                    '          <span class="th-resize" ng-mousedown="mousedown(key,$event)"></span>' +
                    '        </div>' +
                    '      </th>' +
                    '   </tr>' +
                    '</thead>',
                link: function(scope, element, attr) {
                    /*排序*/
                    scope.col = '';
                    var sortType = scope.sortType = null;
                    scope.sort = function(key) {
                        sortType = scope.sortType = sortType === "desc" ? "asc" : "desc";
                        scope.tableList = TableHelper.sort(scope.tableList, key, sortType);
                        scope.col = key;
                        scope.renderViewportRows(0);
                    };
                    scope.objectKeys = function(obj) {
                        return Object.keys(obj);
                    };
                    /*拖拽*/
                    var $tableWrapper = $(element).closest('.table-wrapper');
                    scope.mousedown = function(key, event) {
                        event.preventDefault();
                        var resizeKey = key;
                        var tableWrapperOffset = $tableWrapper.offset();
                        var tableWrapperScrollLeft = $tableWrapper.scrollLeft();
                        var $resizeTh = $(event.target).closest('.th-unit');
                        var $resizeBar = $tableWrapper.find('.resize-bar');
                        var pageX = event.pageX;
                        $document.bind('mousemove', mousemove);
                        $document.bind('mouseup', mouseup);
                        $resizeBar.css({
                            left: event.pageX - tableWrapperOffset.left + tableWrapperScrollLeft
                        });
                        /*
                         *wrapper的样式在IE不能定义为relative，否则会造成滚动卡顿的问题
                         */
                        $tableWrapper.addClass("relative");

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
                            scope.$applyAsync();
                            $resizeBar.css({
                                left: -999999999
                            });
                            $tableWrapper.removeClass("relative");
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
        }
    ]);

angular.module('ui.grid').directive('angularTableRow', ['$compile', function($compile) {
    return {
        restrict: 'EA',
        scope: {
            tr: "=",
            key: "=",
            tableSettings: "=",
            tableOptions: "=",
            selectRow: "&",
            tableList: "="
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
                    '<td data-td-key="{{::key}}" class="td-unit" ng-repeat="key in objectKeys(tr)" ng-init="td=tr[key]" ng-if="::tableOptions[key] && !tableOptions[key].hidden" ng-style="{\'width\':tableOptions[key].width}">' +
                    '   <div ng-if="::tableOptions[key].cellTemplate" table-cell-compile="::td" class="td-inner td-tpl"></div>' +
                    '   <div ng-if="::!tableOptions[key].cellTemplate" ng-bind="::td|tableCellTrans:tableOptions[key]" title="{{::td|tableCellTrans:tableOptions[key]}}" class="td-inner td-text"></div>' +
                    '</td>';
                var rowTemplate = angular.element(template);
                expandedContent = $compile(rowTemplate)(scope.$new());
                element.html(rowTemplate);
            };
            scope.objectKeys = function(obj) {
                return Object.keys(obj);
            };
            render();
            /*
             *获取当前行
             */
            var getCurrentRowIndex = function() {
                for (var i = 0; i < scope.tableList.length; i++) {
                    if (scope.tableList[i].$$hashKey === scope.tr.$$hashKey) {
                        return i;
                        break;
                    }
                }
            };
            /*
             *刷新DOM
             */
            var resetRender = function() {
                parentScope.renderViewportRows();
                parentScope.resizeCellWidth();
            };
            /*
             *刷新当前行
             */
            scope.refresh = function() {
                scope.tableList.splice(getCurrentRowIndex(), 1, angular.copy(scope.tr));
                resetRender();
            };
            /*
             *移除当前行
             */
            scope.remove = function() {
                scope.tableList.splice(getCurrentRowIndex(), 1);
                scope.$destroy();
                resetRender();
            };
        }
    }
}]);

angular.module('ui.grid').directive('angularTable', function() {
    return {
        restrict: 'EA',
        scope: {
            tableOptions: '='
        },
        replace: true,
        template: '<div class="table-responsive table-wrapper">' +
            '   <angular-table-content table-list="tableOptions.tableList" table-settings="tableOptions.tableSettings" table-options="tableOptions.tableOptions">' +
            '   </angular-table-content>' +
            '   <div class="resize-bar"></div>' +
            '</div>',
        link: function(scope, element, attr) {

        }
    };
});

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

angular.module('ui.grid').factory('TableHelper', [function() {
    var Helper = {};
    /*
     *检查是否是时间对象
     */
    Helper.isDate = function(date) {
        return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
    };
    /*
     *转换成时间格式
     *@dateStr 时间戳或标准时间参数
     */
    Helper.newDate = function(dateStr) {
        try {
            if (dateStr && !isNaN(Number(dateStr))) {
                return new Date(Number(dateStr));
            }

        } catch (err) {
            throw new Error(err);
        }
        try {
            //处理 yyyy-mm-dd hh:ii:ss这种非标准格式的日期
            var a = dateStr.split(" ");
            var d = a[0].split("-");
            var result;
            if (a[1]) {
                var t = a[1].split(":");
                result = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
            } else {
                result = new Date(d[0], (d[1] - 1), d[2]);
            }
            return result;
        } catch (err) {
            throw new Error("translate error");
        }
    };
    /*
     *格式化日期
     *@date 时间对象
     *@format yyyy-mm-dd hh:ii:ss
     */
    Helper.format = function(date, format) {
        if (!this.isDate(date)) {
            return "-";
        }
        var date = date;
        var o = {
            "m+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "i+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return format;
    };
    Helper.sort = function(list, key, t, fix) {
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
                    return t === 'asc' ? (fix.call({}, a[key]) - fix.call({}, b[key])) : (fix.call({}, b[key]) - fix.call({}, a[key]));
                });
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
}]);

angular.module('ui.grid').filter('tableCellTrans', ["TableHelper", function(TableHelper) {
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
                text = TableHelper.format(TableHelper.newDate(text), param.formatDate);
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
}]);
