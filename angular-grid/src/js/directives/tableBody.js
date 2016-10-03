angular.module('ui.grid').directive('angularTableBody', [function() {
    return {
        restrict: 'EA',
        replace: true,
        template: '<tbody>' +
            '   <tr angular-table-row ng-class="{selected:tr.checked}" class="table-row" tr="tr" key="key" table-list="tableList" table-settings="tableSettings" table-options="tableOptions" select-row="selectRow(tr,$index)" ng-repeat="tr in viewportList">' +
            '   </tr>' +
            '</tbody>',
        link: function(scope, element, attr) {
            /*选中表格行*/
            scope.selectRow = function(item, index) {
                var selectAll = true;
                for (var i = 0; i < scope.viewportList.length; i++) {
                    if (!scope.viewportList[i].checked) {
                        selectAll = false;
                        break;
                    }
                }
                scope.selectAll = selectAll;
            };
        }
    };
}]);
