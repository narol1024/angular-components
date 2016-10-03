angular.module('ui.grid').directive('angularTable', function() {
    return {
        restrict: 'EA',
        scope: {
            tableOptions: '='
        },
        replace: true,
        template: '<div class="table-responsive table-wrapper">' +
            '   <angular-table-content table-list="tableOptions.tableList" table-settings="tableOptions.tableSettings" table-options="tableOptions.tableOptions">' +
            '   </angular-table-content>' +
            '   <div class="resize-bar"></div>' +
            '</div>',
        link: function(scope, element, attr) {

        }
    };
});
