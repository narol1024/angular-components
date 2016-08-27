angular.module('ui.checkbox', [])
    .directive('angularCheckbox', ["$timeout",function($timeout) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            replace:true,
            scope: {
                value: "=ngModel",
                text: "@checkText",
                onCheck:"&"
            },
            template: '<span class="angular-checkbox"><i class="icon" ng-class="{true: \'icon-check\', false: \'icon-check-empty\'}[check]" ng-click="change()"></i><span class="text" ng-bind="text" ng-click="change()"></span></span>',
            link: function(scope, element, attr, ngModel) {
                if (ngModel) {
                    scope.value = typeof scope.value === "undefined" ? eval(attr.defaultValue) : scope.value;
                    attr.targetValue = eval(attr.targetValue);
                    attr.defaultValue = eval(attr.defaultValue);
                    ngModel.$formatters.push(function(value) {
                        scope.check = eval(scope.value) == attr.targetValue ? true : false;
                        return value;
                    });
                    scope.change = function() {
                        if (attr.disabled) {
                            return;
                        }
                        if (eval(ngModel.$modelValue) === attr.defaultValue) {
                            scope.value = attr.targetValue;
                            scope.check = true;
                        } else {
                            scope.value = attr.defaultValue;
                            scope.check = false;
                        }
                        $timeout(function(){
                            scope.onCheck();
                        });
                    }
                }
            }
        };
    }]);
