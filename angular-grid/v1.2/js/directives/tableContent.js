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
