angular.module("ui.datetimepickerGroup", ["ui.datetimepicker"])
    .directive('datetimepickerGroup', ['dateTimeFactory', function(dateTimeFactory) {
        return {
            restrict: 'EA',
            scope: {
                options: "=",
                startTime: "=",
                endTime: "="
            },
            template: '<input type="text" class="form-control" ng-model="startTime" datetimepicker options="options" placeholder="{{::startTimePlaceholder}}" ng-focus="showStartTime()" name="{{::startName}}" />' +
                '<label class="angular-datetimepicker-groupline">-</label>' +
                '<input type="text" class="form-control" ng-model="endTime" datetimepicker options="options" placeholder="{{::endTimePlaceholder}}" ng-focus="showEndTime()" name="{{::endName}}" />',
            link: function(scope, element, attr) {
                var options = scope.options || {};
                scope.startTimePlaceholder = attr.startTimePlaceholder || "请选择开始时间";
                scope.endTimePlaceholder = attr.endTimePlaceholder || "请选择结束时间";
                scope.startName = attr.startName || "";
                scope.endName = attr.endName || "";

                var $input = element.find("[datetimepicker]");
                options.readOnly === false ? $input.removeAttr("readOnly") : $input.attr("readOnly", "readOnly");
                options.required === true ? $input.attr("required", "required") : $input.removeAttr("required");
                options.disabled === true ? $input.attr("disabled", "disabled") : $input.removeAttr("disabled");
                var limitOutTime = options.limitOutTime;
                var limitStartTime = angular.copy(options.limitStartTime);
                var limitEndTime = angular.copy(options.limitEndTime);
                scope.showStartTime = function() {
                    if (limitOutTime) {
                        /*
                        开始时间：可选的结束日期边界根据结束日期来决定
                         */
                        var endTime = scope.endTime;
                        if (endTime) {
                            options.limitEndTime = endTime;
                        }
                    }
                    if (limitEndTime) {
                        var endTime = scope.endTime;
                        if (endTime) {
                            options.limitEndTime = typeof limitEndTime !== "undefined" && dateTimeFactory.newDate(limitEndTime).getTime() < dateTimeFactory.newDate(endTime).getTime() ? limitEndTime : endTime;
                        }
                    }
                    options.limitStartTime = limitStartTime;
                };
                scope.showEndTime = function() {
                    if (limitOutTime) {
                        /*
                        结束时间：可选开始日期边界根据开始日期来决定
                         */
                        var startTime = scope.startTime;
                        if (startTime) {
                            options.limitStartTime = startTime;
                        }
                    }
                    if (limitStartTime) {
                        var startTime = scope.startTime;
                        if (startTime) {
                            options.limitStartTime = typeof limitStartTime !== "undefined" && dateTimeFactory.newDate(limitStartTime).getTime() > dateTimeFactory.newDate(startTime).getTime() ? limitStartTime : startTime;
                        }
                    }
                    options.limitEndTime = limitEndTime;
                };
                //移除日期选择器
                options.removeDatetimepicker = function() {
                    $input.datetimepicker("remove");
                };
            }
        }
    }]);
