angular.module("ui.pagination", [])
    .directive('angularPagination', ["$timeout",function($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                queryList: "&",
                page: "=page"
            },
            template: '<div class="angular-pagination">' +
                '<ul class="pagination addition-toolbar"><li><a class="total-count" href="javascript:void(0);">共{{page.totalPageCount}}页({{page.totalCount}}条)</a></li></ul>' +
                '<uib-pagination total-items="page.totalCount" items-per-page="page.pageSize" ng-model="page.pageNo" first-text="首页" previous-text="上一页" next-text="下一页" last-text="末页" boundary-links="true" max-size="page.maxSize" force-ellipses="true" ng-change="queryList()"></uib-pagination>' +
                '<ul class="pagination addition-toolbar"><li><a class="jump-wrap" href="javascript:void(0);"><sapn class="jump-input">跳转：<input ng-model="jumpNum" tooltip-placement="top" uib-tooltip="请输入正确的跳转数字" tooltip-trigger="none" tooltip-is-open="tooltipIsOpen" ng-focus="focus()" ng-keyup="keyupJump($event)" type="text"></sapn><span class="jump-submit" ng-click="jump()">确定</span></a></li></ul>' +

                '</div>',
            link: function(scope, element, attr) {
                var tooltipsTimer;
                scope.tooltipIsOpen = false;
                //跳转方法
                scope.jump = function() {
                    var jumpNum = parseInt(scope.jumpNum);
                    scope.tooltipIsOpen = false;
                    if (angular.isNumber(jumpNum) && jumpNum <= scope.page.totalPageCount && jumpNum > 0) {
                        scope.page.pageNo = jumpNum;
                        scope.queryList();
                        scope.jumpNum = "";
                    } else {
                        scope.tooltipIsOpen = true;
                        var tooltipsTimer = $timeout(function() {
                            scope.tooltipIsOpen = false;
                            $timeout.cancel(tooltipsTimer);
                        }, 3000);
                        scope.jumpNum = "";
                    }
                }

                scope.focus = function() {
                    scope.tooltipIsOpen = false;
                }
                //回车跳转
                scope.keyupJump = function(e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        scope.jump();
                    }
                }
            }
        };
    }]);
