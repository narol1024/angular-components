/**
 * 作者:linjinying
 * time:2016-1-13
 * plugin-name: ui.circleSlider
 */
angular.module('ui.circleSlider', []).directive('circleSlider', ['$document', '$timeout', function($document, $timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            options:"=circleSlider"
        },
        template: '<div class="circle" tabIndex="0">' +
            '   <div class="text-wrap"><span class="text"></span></div>' +
            '   <div class="handler"></div>' +
            '</div>',
        link: function(scope, element, attr) {
            var options = scope.options;
            var readonly = options.readonly;
            var onStart = options.onStart;
            var onChange = options.onChange;
            var onFinish = options.onFinish;
            options.value = options.value || 0;
            var max = options.max || 360;
            var $circle = element;
            var $handler = $circle.find('.handler');
            var $text = $circle.find('.text');
            var circleWidthHelf = $circle.width() / 2;
            var handlerWidthHelf = $handler.width() / 2;

            var PI2 = Math.PI / 180;
            var timer;
            var valueWatcher = scope.$watch('options.value', function(newValue, oldValue) {
                transform(options.value);
                if (newValue !== oldValue && onChange) {
                    options.onChange(newValue);
                }
            });
            scope.$on('$destroy', function() {
                valueWatcher();
            });
            function transform(deg) {
                var X = Math.round(circleWidthHelf * Math.sin(deg * PI2));
                var Y = Math.round(circleWidthHelf * -Math.cos(deg * PI2));
                var perc = (deg * max / 360) | 0;
                $handler.css({
                    left: X + circleWidthHelf - handlerWidthHelf,
                    top: Y + circleWidthHelf - handlerWidthHelf
                });
                $text.html(perc + "&deg;");
            }

            //圆环拖动
            $circle.bind('mousedown', function(event) {
                if (!readonly) {
                    var result = calculation(event);
                    if (onStart) {
                        options.onStart(result);
                    }
                    $document.bind('mousemove', calculation);
                    $document.bind('mouseup', mouseup);
                }
            });

            function calculation(event) {
                var circleOffset = $circle.offset();
                var position = {
                    x: event.pageX - circleOffset.left,
                    y: event.pageY - circleOffset.top
                };
                var atan = Math.atan2(position.x - circleWidthHelf, position.y - circleWidthHelf);
                var deg = parseInt(-atan / PI2 + 180);
                    transform(deg);
                timer = $timeout(function() {
                    options.value = deg || options.value;
                    $timeout.cancel(timer);
                }, 30);
                return deg || options.value;
            }

            function mouseup() {
                if (onFinish) {
                    options.onFinish(options.value);
                }
                $document.unbind('mousemove', calculation);
                $document.unbind('mouseup', mouseup)
            }

            //键盘绑定事件
            $circle.bind('keydown', keydown);
            $circle.bind('keyup', keyup);

            function keydown(event) {
                if (onStart) {
                    options.onStart(options.value);
                }
                switch (event.keyCode) {
                    case 40:
                    case 39:
                        scope.$applyAsync(function() {
                            options.value = options.value++ < max ? options.value : 0;
                        });
                        break;
                    case 38:
                    case 37:
                        //left
                        scope.$applyAsync(function() {
                            options.value = options.value-- < 0 ? max : options.value;
                        });
                        break;
                    default:
                        break;
                }
            }

            function keyup() {
                if (onFinish) {
                    options.onFinish(options.value);
                }
            }

        }
    };
}]);
