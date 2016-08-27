angular.module('ui.itempicker', ['ui.checkbox'])
    .directive('angularItempicker', [function() {
        return {
            restrict: 'AE',
            scope: {
                options: '=options',
            },
            template: '<div class="angular-itempicker">' +
                '   <div class="list-wrap source-list-wrap">' +
                '       <div class="search-box" ng-if="::settings.showSearch">' +
                '           <div class="search-item">' +
                '               <input type="text" ng-model="searchSourceName" class="form-control search-box-input" placeholder="{{::settings.searchPlaceholder}}">' +
                '           </div>' +
                '       </div>' +
                '       <div class="select-all">' +
                '           <angular-checkbox on-check="toggleAllSourceList()" ng-disabled="sourceListFiltered.length === 0" ng-model="isSelectAllSourceList" default-value="false" target-value="true" check-text="{{sourceListFiltered.length}}条"></angular-checkbox>' +
                '       </div>' +
                '       <div class="list source-list">' +
                '           <div class="item" ng-repeat="item in options.sourceList | filter:getSourceFilter() as sourceListFiltered">' +
                '               <angular-checkbox on-check="checkItemSourceList()" ng-model="item.checked" default-value="false" target-value="true" check-text="{{::item[settings.value]}}" ></angular-checkbox>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '   <div class="tool-btn-wrap">' +
                '       <button type="button" class="btn" ng-click="pushToRight()" title="左移"><span class="icon icon-chevron-right"></span></button>' +
                '       <button type="button" class="btn" ng-click="pushToLeft()" title="右移"><span class="icon icon-chevron-left"></span></button>' +
                '   </div>' +
                '   <div class="list-wrap target-list-wrap">' +
                '       <div class="search-box" ng-if="::settings.showSearch">' +
                '           <div class="search-item">' +
                '               <input type="text" ng-model="searchTargetName" class="form-control search-box-input" placeholder="{{::settings.searchPlaceholder}}">' +
                '           </div>' +
                '       </div>' +
                '       <div class="select-all">' +
                '           <angular-checkbox  on-check="toggleAllTargetList()" ng-disabled="targetListFiltered.length === 0" ng-model="isSelectAllTargetList" default-value="false" target-value="true" check-text="{{targetListFiltered.length}}条"></angular-checkbox>' +
                '       </div>' +
                '       <div class="list target-list">' +
                '           <div class="item" ng-repeat="item in options.targetList | filter:getTargetFilter() as targetListFiltered">' +
                '               <angular-checkbox on-check="checkItemTargetList()" ng-model="item.checked" default-value="false" target-value="true" check-text="{{::item[settings.value]}}"></angular-checkbox>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>',
            link: function(scope, element, attr) {
                var settings = scope.settings = angular.extend({ key: "id", value: "name", showSearch: true, searchPlaceholder: "请输入搜索内容" }, scope.options.settings);
                var key = settings.key;
                var defaultSource = {}; //默认数据源，供恢复操作使用
                scope.sourceListFiltered = [];
                scope.targetListFiltered = [];
                scope.isSelectAllSourceList = false;
                scope.isSelectAllTargetList = false;
                scope.getSourceFilter = function() {
                    var filterObject = {};
                    filterObject[settings.value] = scope.searchSourceName;
                    return filterObject;
                };
                scope.getTargetFilter = function() {
                    var filterObject = {};
                    filterObject[settings.value] = scope.searchTargetName;
                    return filterObject;
                };
                /*取消左框全部的选择*/
                var cancelAllSourceList = function() {
                    scope.isSelectAllSourceList = false;
                    for (var i = 0; i < scope.options.sourceList.length; i++) {
                        scope.options.sourceList[i].checked = false;
                    }
                };
                /*取消右框全部的选择*/
                var cancelAllTargetList = function() {
                    scope.isSelectAllTargetList = false;
                    for (var i = 0; i < scope.options.targetList.length; i++) {
                        scope.options.targetList[i].checked = false;
                    }
                };
                /*取消左框全部的选择*/
                scope.toggleAllSourceList = function() {
                    if (scope.isSelectAllSourceList) {
                        angular.forEach(scope.sourceListFiltered, function(item) {
                            item.checked = true;
                        });
                    } else {
                        cancelAllSourceList();
                    }
                };
                /*取消右框全部的选择*/
                scope.toggleAllTargetList = function() {
                    if (scope.isSelectAllTargetList) {
                        angular.forEach(scope.targetListFiltered, function(item) {
                            item.checked = true;
                        });
                    } else {
                        cancelAllTargetList();
                    }
                };
                /*选中左边的单项*/
                scope.checkItemSourceList = function() {
                    for (var i = 0; i < scope.sourceListFiltered.length; i++) {
                        if (!scope.sourceListFiltered[i].checked) {
                            scope.isSelectAllSourceList = false;
                            return;
                        }
                    }
                    scope.isSelectAllSourceList = true;
                };
                /*选中右边的单项*/
                scope.checkItemTargetList = function() {
                    for (var i = 0; i < scope.targetListFiltered.length; i++) {
                        if (!scope.targetListFiltered[i].checked) {
                            scope.isSelectAllTargetList = false;
                            return;
                        }
                    }
                    scope.isSelectAllTargetList = true;
                };
                /*右移*/
                scope.pushToRight = function() {
                    var checkedArray = [];
                    angular.forEach(scope.sourceListFiltered, function(item) {
                        if (item.checked) {
                            checkedArray.push(item);
                        }
                    });
                    if (checkedArray.length > 0) {
                        scope.searchTargetName = "";
                        scope.options.targetList = scope.options.targetList.concat(angular.copy(checkedArray));
                        var tempSourceList = scope.options.sourceList;
                        for (var i = 0; i < checkedArray.length; i++) {
                            var currrentId = checkedArray[i][key];
                            for (var j = 0; j < tempSourceList.length; j++) {
                                if (currrentId === tempSourceList[j][key]) {
                                    tempSourceList.splice(j, 1);
                                }
                            }
                        }
                        cancelAllSourceList();
                        cancelAllTargetList();
                    }
                };
                /*左移*/
                scope.pushToLeft = function() {
                    var checkedArray = [];
                    angular.forEach(scope.targetListFiltered, function(item) {
                        if (item.checked) {
                            checkedArray.push(item);
                        }
                    });
                    if (checkedArray.length > 0) {
                        scope.options.sourceList = scope.options.sourceList.concat(angular.copy(checkedArray));
                        var tempTargetList = scope.options.targetList;
                        for (var i = 0; i < checkedArray.length; i++) {
                            var currrentId = checkedArray[i][key];
                            for (var j = 0; j < tempTargetList.length; j++) {
                                if (currrentId === tempTargetList[j][key]) {
                                    tempTargetList.splice(j, 1);
                                }
                            }
                        }
                        cancelAllSourceList();
                        cancelAllTargetList();
                    }
                };
            }
        };
    }]);
