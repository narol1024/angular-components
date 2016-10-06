angular.module('ui.itempicker', ['ui.checkbox'])
    .directive('angularItempicker', [function() {
        return {
            restrict: 'AE',
            scope: {
                options: '=options',
            },
            template: '<div class="angular-itempicker">' +
                '   <item-picker-source-list></item-picker-source-list>' +
                '   <item-picker-toolbar></item-picker-toolbar>' +
                '   <item-picker-target-list></item-picker-target-list>' +
                '</div>',
            controller: ['$scope', function($scope) {
                $scope.settings = angular.extend({ key: "id", value: "name", showSearch: true, searchPlaceholder: "请输入搜索内容" }, $scope.options.settings);
                $scope.sourceListFiltered = [];
                $scope.targetListFiltered = [];
                $scope.search = {};
                $scope.options.sourceList = $scope.options.sourceList || [];
                $scope.options.targetList = $scope.options.targetList || [];
                /*
                 *检查是否检查选中所有
                 */
                $scope.isCheckAll = function(list) {
                    var result = true;
                    for (var i = 0; i < list.length; i++) {
                        if (!list[i].checked) {
                            result = false;
                        }
                    }
                    if(!list.length){
                        result = false;
                    }
                    return result;
                };
                /*
                *获取结果
                */
                $scope.options.getResult = function(){
                    var resultArray = [];
                    var targetList = $scope.options.targetList;
                    for(var i = 0 ; i < targetList.length ; i++){
                        var tempObject = {};
                        var key = $scope.settings.key;
                        var value = $scope.settings.value;
                        tempObject[key] = targetList[i][key];
                        tempObject[value] = targetList[i][value];
                        resultArray.push(tempObject);
                    }
                    return resultArray;
                };
            }],
            link: function($scope, element, attr) {

            }
        };
    }]);

angular.module('ui.itempicker')
    .directive('itemPickerSourceList', [function() {
        return {
            replace:true,
            restrict: 'E',
            template: '<div class="list-wrap">' +
                '   <div class="search-wrap" ng-if="::settings.showSearch">' +
                '      <input type="text" ng-model="search.leftName" placeholder="{{::settings.searchPlaceholder}}" />' +
                '   </div>' +
                '   <div class="select-all">' +
                '      <input angular-checkbox="checkboxLeftAllOptions" ng-disabled="sourceListFiltered.length === 0" type="checkbox" ng-model="selectAllLeft" ng-true-value="true" ng-false-value="false" value="sourceListFiltered.length+\'条\'" />' +
                '   </div>' +
                '   <div class="list">' +
                '      <div class="item" ng-repeat="item in options.sourceList | filter:getSourceFilter() as sourceListFiltered">' +
                '         <input angular-checkbox="checkboxLeftOptions" type="checkbox" ng-model="item.checked" ng-true-value="true" ng-false-value="false" value="item[settings.value]" />' +
                '      </div>' +
                '   </div>' +
                '</div>',
            controller: ['$scope', function($scope) {
                $scope.checkboxLeftAllOptions = {
                    onCheck: function() {
                        $scope.checkAllLeftList();
                    }
                };
                $scope.checkboxLeftOptions = {
                    onCheck: function() {
                        $scope.checkLeftList();
                    }
                };
                $scope.getSourceFilter = function() {
                    var filterObject = {};
                    filterObject[$scope.settings.value] = $scope.search.leftName;
                    $scope.checkLeftList();
                    return filterObject;
                };
                /*选中左边的单项*/
                $scope.checkLeftList = function() {
                    $scope.selectAllLeft = $scope.isCheckAll($scope.sourceListFiltered);
                };
                /*
                 *全部选中左边
                 */
                $scope.checkAllLeftList = function() {
                    if (!$scope.selectAllLeft) {
                        $scope.selectAllLeft = true;
                        angular.forEach($scope.sourceListFiltered, function(item) {
                            item.checked = true;
                        });
                    } else {
                        $scope.uncheckAllLeftList();
                    }
                };
                /*
                 *取消全部选中左边
                 */
                $scope.uncheckAllLeftList = function() {
                    $scope.selectAllLeft = false;
                    angular.forEach($scope.options.sourceList, function(item) {
                        item.checked = false;
                    });
                };
            }],
            link: function(scope, element, attr) {

            }
        };
    }]);

angular.module('ui.itempicker')
    .directive('itemPickerTargetList', [function() {
        return {
            replace:true,
            restrict: 'E',
            template: '<div class="list-wrap">' +
                '   <div class="search-wrap" ng-if="::settings.showSearch">' +
                '      <input type="text" ng-model="search.rightName" placeholder="{{::settings.searchPlaceholder}}" />' +
                '   </div>' +
                '   <div class="select-all">' +
                '      <input angular-checkbox="checkboxRightAllOptions" ng-disabled="targetListFiltered.length === 0" type="checkbox" ng-model="selectAllRight" ng-true-value="true" ng-false-value="false" value="targetListFiltered.length+\'条\'" />' +
                '   </div>' +
                '   <div class="list">' +
                '       <div class="item" ng-repeat="item in options.targetList | filter:getTargetFilter() as targetListFiltered">' +
                '         <input angular-checkbox="checkboxRightOptions" type="checkbox" ng-model="item.checked" ng-true-value="true" ng-false-value="false" value="item[settings.value]" />' +
                '       </div>' +
                '   </div>' +
                '</div>',
            controller: ['$scope', function($scope) {
                $scope.checkboxRightAllOptions = {
                    onCheck: function() {
                        $scope.checkAllRightList();
                    }
                };
                $scope.checkboxRightOptions = {
                    onCheck: function() {
                        $scope.checkRightList();
                    }
                };
                /*
                *搜索右边数据
                */
                $scope.getTargetFilter = function() {
                    var filterObject = {};
                    filterObject[$scope.settings.value] = $scope.search.rightName;
                    $scope.checkRightList();
                    return filterObject;
                };
                /*选中右边的单项*/
                $scope.checkRightList = function() {
                    $scope.selectAllRight = $scope.isCheckAll($scope.targetListFiltered);
                };
                /*
                 *全部选中左边
                 */
                $scope.checkAllRightList = function() {
                    if (!$scope.selectAllRight) {
                        $scope.selectAllRight = true;
                        angular.forEach($scope.targetListFiltered, function(item) {
                            item.checked = true;
                        });
                    } else {
                        $scope.uncheckAllRightList();
                    }
                };
                /*
                 *取消全部选中左边
                 */
                $scope.uncheckAllRightList = function() {
                    $scope.selectAllRight = false;
                    angular.forEach($scope.options.targetList, function(item) {
                        item.checked = false;
                    });
                };
            }],
            link: function(scope, element, attr) {

            }
        };
    }]);

angular.module('ui.itempicker')
    .directive('itemPickerToolbar', [function() {
        return {
            replace: true,
            restrict: 'E',
            template: '<div class="tool-btn-wrap">' +
                '    <button type="button" class="btn" ng-click="pushLeft()" title="右移"><span class="icon-arrow-left"></span></button>' +
                '    <button type="button" class="btn" ng-click="pushRight()" title="左移"><span class="icon-arrow-right"></span></button>' +
                '</div>',
            controller: ['$scope', function($scope) {
                var key = $scope.settings.key;
                var value = $scope.settings.value;
                var pushItem = function(options) {
                    var currentList = options.currentList;
                    var listFiltered = options.listFiltered;
                    var targetList = options.targetList;
                    var noCheck = true;
                    for (var i = listFiltered.length; i--;) {
                        if (listFiltered[i].checked) {
                            noCheck = false;
                            targetList.unshift(angular.copy(listFiltered[i]));
                            for (var j = currentList.length; j--;) {
                                if (currentList[j][key] === listFiltered[i][key] &&
                                    currentList[j][value] === listFiltered[i][value]) {
                                    currentList.splice(j, 1);
                                    break;
                                }
                            }
                            listFiltered.splice(i, 1);
                        }
                    }
                    if (!noCheck) {
                        $scope.uncheckAllLeftList();
                        $scope.uncheckAllRightList();
                    }
                };
                /*右移*/
                $scope.pushRight = function() {
                    pushItem({
                        listFiltered:$scope.sourceListFiltered,
                        currentList:$scope.options.sourceList,
                        targetList:$scope.options.targetList
                    });

                };
                /*左移*/
                $scope.pushLeft = function() {
                    pushItem({
                        listFiltered:$scope.targetListFiltered,
                        currentList:$scope.options.targetList,
                        targetList:$scope.options.sourceList
                    });
                };
            }],
            link: function(scope, element, attr) {

            }
        };
    }]);
