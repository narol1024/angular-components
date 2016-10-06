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
