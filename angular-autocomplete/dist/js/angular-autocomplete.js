angular.module("ui.autocomplete",[]).directive('angularAutocomplete', [function() {
    return {
        restrict: 'EA',
        scope: {
            autocompleteOptions: "="
        },
        require: '?ngModel',
        link: function(scope, element, attr, ngModel) {
            var options = angular.extend(scope.autocompleteOptions, {
                noCache:true,
                onSelect: function(suggestion) {
                    var value = suggestion.value;
                    if (ngModel.$modelValue !== value) {
                        scope.$apply(function() {
                            ngModel.$setViewValue(value);
                        });
                    }
                    if (angular.isFunction(scope.autocompleteOptions.onSelectCallback)) {
                        scope.autocompleteOptions.onSelectCallback(suggestion);
                    }
                },
                onSearchComplete: function(query, suggestions) {
                    if (angular.isFunction(scope.autocompleteOptions.onSearchCompleteCallback)) {
                        scope.autocompleteOptions.onSearchCompleteCallback(query, suggestions);
                    }
                }
            });
            $(element).autocomplete(options);
        }
    }
}]);
