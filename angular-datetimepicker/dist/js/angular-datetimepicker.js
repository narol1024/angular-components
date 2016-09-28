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
                var LIMIT_START_TIME = options.LIMIT_START_TIME = angular.copy(options.limitStartTime);
                var LIMIT_END_TIME = options.LIMIT_END_TIME = angular.copy(options.limitEndTime);
                var isExist = {};
                isExist.year = format.indexOf("yyyy") >= 0;
                isExist.month = format.indexOf("mm") >= 0;
                isExist.day = format.indexOf("dd") >= 0;
                isExist.hour = format.indexOf("hh") >= 0;
                isExist.mintue = format.indexOf("ii") >= 0;
                isExist.second = format.indexOf("ss") >= 0;
                dateOptions = angular.extend({
                    weekStart: 1,
                    todayBtn: true,
                    todayHighlight: true,
                    customIcon: true,
                    format: format,
                    autoclose: 1,
                    forceParse: 0,
                    bootcssVer: 2,
                    language: "zh-CN",
                    clearBtn: options.clearBtn !== false
                }, dateOptions);
                var viewMap = {
                    yearView: 4,
                    monthView: 3,
                    dayView: 2,
                    hourView: 1,
                    mintueView: 0
                };
                if (isExist.year) {
                    dateOptions.startView = 4;
                    dateOptions.minView = 4;
                    dateOptions.maxView = 4;
                    if (isExist.month) {
                        dateOptions.startView = 3;
                        dateOptions.minView = 3;
                        dateOptions.maxView = 4;
                        if (isExist.day) {
                            dateOptions.startView = 2;
                            dateOptions.minView = 2;
                            dateOptions.maxView = 4;
                            if (isExist.hour) {
                                dateOptions.startView = 2;
                                dateOptions.minView = 1;
                                dateOptions.maxView = 4;
                                if (isExist.mintue) {
                                    dateOptions.startView = 2;
                                    dateOptions.minView = 0;
                                    dateOptions.maxView = 4;
                                }
                            }
                        }
                    }
                }
                /*
                 *初始化组件
                 */
                var datetimepicker = element.datetimepicker(dateOptions);
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
                    /*
                     *事件注册
                     */
                var totalEvents = ["show", "hide", "changeDate", "changeYear", "changeMonth", "outOfRange", "next"];
                angular.forEach(totalEvents, function(eventItem) {
                    var onEventName = "on" + eventItem[0].toUpperCase() + eventItem.slice(1);
                    if (angular.isFunction(options[onEventName])) {
                        datetimepicker.on(eventItem, options[onEventName]);
                    }
                });
                /*
                 *利用hide event做一些hooks:
                 */
                var resetDatetimeGroupRange = function() {
                    var datetimeGroup = options.relativeGroup();
                    var groupId = datetimeGroup.groupId;
                    var relativeDatetime = datetimeGroup.relativeDatetime;
                    var relativeOptions = datetimeGroup.relativeOptions;
                    var currentScopeValue = ngModelCtrl.$modelValue;
                    switch (groupId) {
                        case "startTime":
                            if (currentScopeValue && relativeOptions.LIMIT_START_TIME) {
                                var currentScopeValueOf = new Date(currentScopeValue.replace(' ', 'T')).valueOf();
                                var limitStartTimeValueOf = new Date(relativeOptions.LIMIT_START_TIME.replace(' ', 'T')).valueOf();
                                relativeOptions.limitStartTime = currentScopeValueOf > limitStartTimeValueOf ? currentScopeValue : relativeOptions.LIMIT_START_TIME;
                            } else {
                                relativeOptions.limitStartTime = relativeOptions.LIMIT_START_TIME || currentScopeValue;
                            }
                            if (relativeDatetime && LIMIT_END_TIME) {
                                var relativeDatetimeValueOf = new Date(relativeDatetime.replace(' ', 'T')).valueOf();
                                var limitEndTimeValueOf = new Date(LIMIT_END_TIME.replace(' ', 'T')).valueOf();
                                options.limitEndTime = limitEndTimeValueOf < relativeDatetimeValueOf ? LIMIT_END_TIME : relativeDatetime;
                            } else {
                                options.limitEndTime = LIMIT_END_TIME || relativeDatetime;

                            }
                            break;
                        case "endTime":
                            if (currentScopeValue && relativeOptions.LIMIT_END_TIME) {
                                var currentScopeValueOf = new Date(currentScopeValue.replace(' ', 'T')).valueOf();
                                var limitEndTimeValueOf = new Date(relativeOptions.LIMIT_END_TIME.replace(' ', 'T')).valueOf();
                                relativeOptions.limitEndTime = limitEndTimeValueOf < currentScopeValueOf ? relativeOptions.LIMIT_END_TIME : currentScopeValue;
                            } else {
                                relativeOptions.limitEndTime = relativeOptions.LIMIT_END_TIME || currentScopeValue;
                            }
                            if (relativeDatetime && LIMIT_START_TIME) {
                                var relativeDatetimeValueOf = new Date(relativeDatetime.replace(' ', 'T')).valueOf();
                                var limitStartTimeValueOf = new Date(LIMIT_START_TIME.replace(' ', 'T')).valueOf();
                                options.limitStartTime = relativeDatetimeValueOf > limitStartTimeValueOf ? relativeDatetime : LIMIT_START_TIME;
                            } else {
                                options.limitStartTime = LIMIT_START_TIME || relativeDatetime;
                            }
                            break;
                        default:
                            ;
                    }
                    scope.$apply();
                };
                var fixDblick = function() {
                    $(element).blur();
                };
                datetimepicker.on("hide", function() {
                    /*
                     *解决日期选择器双击不能打开的bug
                     */
                    fixDblick();
                    /*
                     *时间日期组合可选的边界
                     */
                    resetDatetimeGroupRange();
                });
            }
        }
    }]);
