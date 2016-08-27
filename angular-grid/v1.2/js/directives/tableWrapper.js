angular.module('ui.grid').directive('angularTable', function() {
    return {
        restrict: 'EA',
        scope: {
            tableParams: '='
        },
        replace: true,
        template: '<div class="table-responsive table-wrapper">' +
            '   <angular-table-content table-list="tableParams.tableList" table-settings="tableParams.tableSettings" table-options="tableParams.tableOptions">' +
            '   </angular-table-content>' +
            '   <div class="resize-bar"></div>' +
            '</div>',
        link: function(scope, element, attr) {

        }
    };
})
