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
