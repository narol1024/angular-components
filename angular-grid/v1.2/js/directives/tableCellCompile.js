angular.module('ui.grid').directive('tableCellCompile', ['$compile', function($compile) {
    return function(scope, element, attrs) {
        scope.$watch(function(scope) {
            return scope.$eval(attrs.tableCellCompile);
        }, function(value) {
            element.html(value);
            $compile(element.contents())(scope);
        });
    };
}]);
