angular.module('ui.checkbox', [])
    .directive('angularCheckbox', [function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            replace: true,
            scope: {
                options: "=angularCheckbox"
            },
            link: function(scope, element, attr, ngModel) {
                /*generate random checkbox id*/
                var options = scope.options;
                var checkboxId = "angular-checkbox-" + (((1 + Math.random()) * new Date().getTime()) | 0).toString(16).substring(1);
                var checkboxElement = 
                        '<label for="' + checkboxId + '">'+
                            (angular.isDefined(options.text) ? 
                            '<span class="text">'+options.text+'</span>' : '') +
                        '</label>';
                element.attr('id', checkboxId).after(checkboxElement);
                element.bind('click',options.onCheck);
            }
        };
    }]);
