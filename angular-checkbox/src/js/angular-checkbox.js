angular.module('ui.checkbox', [])
    .directive('angularCheckbox', [function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            replace: true,
            scope: {
                options: "=angularCheckbox",
                text: "=value"
            },
            link: function(scope, element, attr, ngModel) {
                /*
                 *生成checkbox ID
                 */
                var options = scope.options;
                var checkboxId = "angular-checkbox-" + (((1 + Math.random()) * new Date().getTime()) | 0).toString(16).substring(1);
                var checkboxElement =
                    '<label for="' + checkboxId + '">' +
                    (angular.isDefined(scope.text) ?
                        '<span class="text">' + (scope.text) + '</span>' : '') +
                    '</label>';
                element.attr('id', checkboxId).after(checkboxElement);
                element.bind('click', function() {
                    options.onCheck(scope);
                    scope.$applyAsync();
                });
                var valueWatcher = scope.$watch('text', function(currentValue, lastValue) {
                    if (currentValue !== lastValue) {
                        element.next().find('span').html(currentValue);
                    }
                });
                scope.$on('$destroy', function() {
                    valueWatcher();
                })
            }
        };
    }]);
