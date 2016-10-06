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
                '      <input angular-checkbox="checkboxLeftAllOptions" ng-disabled="sourceListFiltered.length === 0" class="angular-checkbox" type="checkbox" ng-model="selectAllLeft" ng-true-value="true" ng-false-value="false" value="sourceListFiltered.length+\'条\'" />' +
                '   </div>' +
                '   <div class="list">' +
                '      <div class="item" ng-repeat="item in options.sourceList | filter:getSourceFilter() as sourceListFiltered">' +
                '         <input angular-checkbox="checkboxLeftOptions" class="angular-checkbox" type="checkbox" ng-model="item.checked" ng-true-value="true" ng-false-value="false" value="item[settings.value]" />' +
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
