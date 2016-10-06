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
                '      <input angular-checkbox="checkboxRightAllOptions" ng-disabled="targetListFiltered.length === 0" class="angular-checkbox" type="checkbox" ng-model="selectAllRight" ng-true-value="true" ng-false-value="false" value="targetListFiltered.length+\'条\'" />' +
                '   </div>' +
                '   <div class="list">' +
                '       <div class="item" ng-repeat="item in options.targetList | filter:getTargetFilter() as targetListFiltered">' +
                '         <input angular-checkbox="checkboxRightOptions"  class="angular-checkbox" type="checkbox" ng-model="item.checked" ng-true-value="true" ng-false-value="false" value="item[settings.value]" />' +
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
