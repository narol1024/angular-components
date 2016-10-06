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
                    '<td data-td-key="{{::key}}" class="td-unit" ng-repeat="key in objectKeys(tr) track by $index" ng-init="td=tr[key]" ng-if="::tableOptions[key] && !tableOptions[key].hidden" ng-style="{\'width\':tableOptions[key].width}">' +
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
