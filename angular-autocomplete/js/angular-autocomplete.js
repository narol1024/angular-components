angular.module("ui.autocomplete",[]).directive('angularAutocomplete', [function() {
    return {
        restrict: 'EA',
        scope: {
            autocompleteOptions: "=angularAutocomplete"
        },
        require: '?ngModel',
        link: function(scope, element, attr, ngModel) {
            var scopeAutocompleteOptions = scope.autocompleteOptions;
            var autocompleteOptions = angular.extend({},scopeAutocompleteOptions);
            //set model value
            var options = angular.extend(autocompleteOptions, {
                onSelect: function(suggestion) {
                    var value = suggestion.value;
                    if (ngModel.$modelValue !== value) {
                        scope.$apply(function() {
                            ngModel.$setViewValue(value);
                        });
                    }
                    if (angular.isFunction(scopeAutocompleteOptions.onSelect)) {
                        scopeAutocompleteOptions.onSelect(suggestion);
                    }
                }
            });
            $(element).autocomplete(options);
        }
    }
}]);
