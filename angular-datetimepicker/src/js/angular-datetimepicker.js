angular.module('ui.datetimepicker', [])
    .directive('datetimepicker', [function() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                options: "=datetimepicker"
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                var options = scope.options || {};
                var format = options.format || "yyyy-mm-dd";

                var dateOptions = {};
                var isExist = {};
                isExist.year = format.indexOf("yyyy") >= 0;
                isExist.month = format.indexOf("mm") >= 0;
                isExist.day = format.indexOf("dd") >= 0;
                isExist.hour = format.indexOf("hh") >= 0;
                isExist.mintue = format.indexOf("ii") >= 0;
                isExist.second = format.indexOf("ss") >= 0;
                dateOptions = angular.extend({
                    weekStart:1,
                    todayBtn:true,
                    todayHighlight:true,
                    customIcon: true,
                    format: format,
                    autoclose: 1,
                    forceParse: 0,
                    bootcssVer: 2,
                    language: "zh-CN",
                    clearBtn: options.clearBtn !== false
                }, dateOptions);
                var viewMap = {
                    yearView:4,
                    monthView:3,
                    dayView:2,
                    hourView:1,
                    mintueView:0
                };
                if(isExist.year){
                    dateOptions.startView = 4; 
                    dateOptions.minView = 4;
                    dateOptions.maxView = 4;
                    if(isExist.month){
                        dateOptions.startView = 3; 
                        dateOptions.minView = 3;
                        dateOptions.maxView = 4;
                        if(isExist.day){
                            dateOptions.startView = 2; 
                            dateOptions.minView = 2;
                            dateOptions.maxView = 4;
                            if(isExist.hour){
                                dateOptions.startView = 2; 
                                dateOptions.minView = 1;
                                dateOptions.maxView = 4;
                                if(isExist.mintue){
                                    dateOptions.startView = 2; 
                                    dateOptions.minView = 0;
                                    dateOptions.maxView = 4;
                                }
                            }
                        }
                    }
                }
                /*
                *解决日期选择器双击不能打开的bug
                */
                element.datetimepicker(dateOptions).on("hide", function() {
                    $(element).blur();
                });
                var limitStartTimeWatcher = scope.$watch('options.limitStartTime', function(currentValue, lastValue) {
                    if (currentValue !== lastValue || typeof lastValue !== "undefined") {
                        element.datetimepicker("setStartDate", currentValue);
                    }
                });
                var limitEndTimeWatcher = scope.$watch('options.limitEndTime', function(currentValue, lastValue) {
                    if (currentValue !== lastValue || typeof lastValue !== "undefined") {
                        element.datetimepicker("setEndDate", currentValue);
                    }
                });
                /*
                *移除日期选择器
                */
                options.removeDatetimepicker = function() {
                    element.datetimepicker("remove");
                    limitStartTimeWatcher();
                    limitEndTimeWatcher();
                }
            }
        }
    }]);
