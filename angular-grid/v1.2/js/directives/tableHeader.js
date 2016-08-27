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
