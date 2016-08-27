angular.module('ui.datetimepicker', ["ngDatetime"])
    .directive('datetimepicker', ["$timeout", "dateTimeFactory", function($timeout, dateTimeFactory) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                options: "="
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                element.wrap("<label class='angular-datetimepicker'></label>");
                var options = scope.options || {};
                format = typeof options.format === "undefined" ? "yyyy-mm-dd" : options.format;
                ngModelCtrl.$formatters.push(function(value) {
                    return angular.isNumber(value) ? dateTimeFactory.format(new Date(value), format) : value;
                });

                var dateOptions = {};
                var isExist = {};
                isExist.year = format.indexOf("yyyy") >= 0;
                isExist.month = format.indexOf("mm") >= 0;
                isExist.day = format.indexOf("dd") >= 0;
                isExist.hour = format.indexOf("hh") >= 0;
                isExist.mintue = format.indexOf("ii") >= 0;
                isExist.second = format.indexOf("ss") >= 0;
                dateOptions.fontAwesome = true;
                dateOptions.format = format;
                dateOptions.autoclose = 1;
                dateOptions.forceParse = 0;
                dateOptions.bootcssVer = 2;
                dateOptions.language = "zh-CN";
                dateOptions.clearBtn = options.clearBtn === false ? false : true;

                if (isExist.year) {
                    dateOptions.weekStart = 1;
                }
                if (isExist.day) {
                    dateOptions.todayBtn = 1;
                    dateOptions.todayHighlight = 1;
                }
                if (!isExist.year && !isExist.month && !isExist.day) {
                    dateOptions.startView = 1;
                    dateOptions.maxView = 1;
                    dateOptions.minView = 0;
                }
                if (isExist.hour && !isExist.mintue && !isExist.second && isExist.year && isExist.month && isExist.day) {
                    dateOptions.startView = 2; //format:yyyy/mm/dd
                    dateOptions.minView = 1;
                }
                if (!isExist.hour && !isExist.mintue && !isExist.second && isExist.year && isExist.month && isExist.day) {
                    dateOptions.startView = 2; //format:yyyy/mm/dd
                    dateOptions.minView = 2;
                }
                if (!isExist.hour && !isExist.mintue && !isExist.second && isExist.year && isExist.month && !isExist.day) {
                    dateOptions.startView = 3; //format:yyyy/mm
                    dateOptions.minView = 3;
                }
                element.datetimepicker(dateOptions).on("hide", function() {
                    /*解决日期选择器双击不能打开的bug*/
                    $(element).blur();
                });
                scope.$watch('options.limitStartTime', function(currentValue, lastValue) {
                    if (currentValue !== lastValue || typeof lastValue !== "undefined") {
                        element.datetimepicker("setStartDate", angular.isNumber(currentValue) ? dateTimeFactory.format(new Date(currentValue), 'yyyy-mm-dd') : currentValue);
                    }
                });
                scope.$watch('options.limitEndTime', function(currentValue, lastValue) {
                    if (currentValue !== lastValue || typeof lastValue !== "undefined") {
                        element.datetimepicker("setEndDate", angular.isNumber(currentValue) ? dateTimeFactory.format(new Date(currentValue), 'yyyy-mm-dd') : currentValue);
                    }
                });
                //移除日期选择器
                options.removeDatetimepicker = function(){
                    element.datetimepicker("remove");
                }
            }
        }
    }]);
