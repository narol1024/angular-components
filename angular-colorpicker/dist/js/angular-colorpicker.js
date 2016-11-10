/**
 * author:narol
 * create Date:2016-1-14
 * update Date:2016-05-30
 * component-name: ui.colorpicker
 */
angular.module('ui.colorpicker', [])
    .value('colorpicker.language', {
        "zh-cn": {
            "PALETTE": "经典",
            "WHEEL": "自定义",
            "HISTORY": "历史记录",
            "SELECT": "选择",
            "CANCEL": "取消"
        },
        "zh-tw":{
            "PALETTE": "經典",
            "WHEEL": "自定義",
            "HISTORY": "歷史記錄",
            "SELECT": "選擇",
            "CANCEL": "取消"
        },
        "en": {
            "PALETTE": "Palette",
            "WHEEL": "Wheel",
            "HISTORY": "History",
            "SELECT": "Select",
            "CANCEL": "Cancel"
        },
        "fr": {
            "PALETTE": "Palette",
            "WHEEL": "Roue",
            "HISTORY": "Historique",
            "SELECT": "Sélectionner",
            "CANCEL": "Annuler"
        },
        "pt": {
            "PALETTE": "Paleta",
            "WHEEL": "Personalizar",
            "HISTORY": "Recentes",
            "SELECT": "Selecionar",
            "CANCEL": "Cancelar"
        }
    })
    .factory('colorpicker.helper', ['$document', function($document) {
        return {
            setCookie: function(name, value) {
                var days = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            },
            getCookie: function(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) {
                    return unescape(arr[2]);
                } else {
                    return null;
                }
            },
            deleteCookie: function(name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = getCookie(name);
                if (cval != null) {
                    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
                }
            },
            enabledCookie: function(name) {
                return "string" == typeof this.getCookie(name) ? true : false;
            },
            stringParsers: [{
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                parse: function(execResult) {
                    return [
                        execResult[1],
                        execResult[2],
                        execResult[3],
                        execResult[4]
                    ];
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                parse: function(execResult) {
                    return [
                        2.55 * execResult[1],
                        2.55 * execResult[2],
                        2.55 * execResult[3],
                        execResult[4]
                    ];
                }
            }, {
                re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
                parse: function(execResult) {
                    return [
                        parseInt(execResult[1], 16),
                        parseInt(execResult[2], 16),
                        parseInt(execResult[3], 16)
                    ];
                }
            }, {
                re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
                parse: function(execResult) {
                    return [
                        parseInt(execResult[1] + execResult[1], 16),
                        parseInt(execResult[2] + execResult[2], 16),
                        parseInt(execResult[3] + execResult[3], 16)
                    ];
                }
            }]
        };
    }]).factory('colorpicker.transColor', ['colorpicker.helper', function(Helper) {
        return {
            value: {
                h: 1,
                s: 1,
                b: 1,
                a: 1
            },
            'rgb': function() {
                var rgb = this.toRGB();
                return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
            },
            'rgba': function() {
                var rgb = this.toRGB();
                return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
            },
            'hex': function() {
                return this.toHex();
            },

            // HSBtoRGB from RaphaelJS
            RGBtoHSB: function(r, g, b, a) {
                r /= 255;
                g /= 255;
                b /= 255;

                var H, S, V, C;
                V = Math.max(r, g, b);
                C = V - Math.min(r, g, b);
                H = (C === 0 ? null :
                    V === r ? (g - b) / C :
                    V === g ? (b - r) / C + 2 :
                    (r - g) / C + 4
                );
                H = ((H + 360) % 6) * 60 / 360;
                S = C === 0 ? 0 : C / V;
                return {
                    h: H || 1,
                    s: S,
                    b: V,
                    a: a || 1
                };
            },

            //parse a string to HSB
            setColor: function(val) {
                val = val.toLowerCase();
                for (var key in Helper.stringParsers) {
                    if (Helper.stringParsers.hasOwnProperty(key)) {
                        var parser = Helper.stringParsers[key];
                        var match = parser.re.exec(val),
                            values = match && parser.parse(match);
                        if (values) {
                            this.value = this.RGBtoHSB.apply(null, values);
                            return false;
                        }
                    }
                }
            },

            setHue: function(h) {
                this.value.h = 1 - h;
            },

            setSaturation: function(s) {
                this.value.s = s;
            },

            setLightness: function(b) {
                this.value.b = 1 - b;
            },

            setAlpha: function(a) {
                this.value.a = parseInt((1 - a) * 100, 10) / 100;
            },
            toRGB: function(h, s, b, a) {
                if (!h) {
                    h = this.value.h;
                    s = this.value.s;
                    b = this.value.b;
                }
                h *= 360;
                var R, G, B, X, C;
                h = (h % 360) / 60;
                C = b * s;
                X = C * (1 - Math.abs(h % 2 - 1));
                R = G = B = b - C;

                h = ~~h;
                R += [C, X, 0, 0, X, C][h];
                G += [X, C, C, X, 0, 0][h];
                B += [0, 0, X, C, C, X][h];
                return {
                    r: Math.round(R * 255),
                    g: Math.round(G * 255),
                    b: Math.round(B * 255),
                    a: a || this.value.a
                };
            },

            toHex: function(h, s, b, a) {
                var rgb = this.toRGB(h, s, b, a);
                return '#' + ((1 << 24) | (parseInt(rgb.r, 10) << 16) | (parseInt(rgb.g, 10) << 8) | parseInt(rgb.b, 10)).toString(16).substr(1);
            }
        };
    }])
    .factory('colorpicker.slider', function() {
        'use strict';
        var slider = {
                maxLeft: 0,
                maxTop: 0,
                callLeft: null,
                callTop: null,
                knob: {
                    top: 0,
                    left: 0
                }
            },
            pointer = {};

        return {
            getOffset: function(elem) {
                var scrollX = 0,
                    scrollY = 0,
                    rect = elem.getBoundingClientRect();
                while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
                    if (elem.tagName === 'BODY') {
                        scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
                        scrollY += document.documentElement.scrollTop || elem.scrollTop;
                    } else {
                        scrollX += elem.scrollLeft;
                        scrollY += elem.scrollTop;
                    }
                    elem = elem.offsetParent;
                }
                return {
                    top: rect.top + window.pageYOffset,
                    left: rect.left - 130 + window.pageXOffset,
                    scrollX: scrollX,
                    scrollY: scrollY
                };
            },
            closestSlider: function(elem) {
                var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
                if (matchesSelector.bind(elem)('I')) {
                    return elem.parentNode;
                }
                return elem;
            },
            getSlider: function() {
                return slider;
            },
            getLeftPosition: function(event) {
                return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || pointer.left) - pointer.left)));
            },
            getTopPosition: function(event) {
                return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || pointer.top) - pointer.top)));
            },
            setSlider: function(event) {
                var target = this.closestSlider(event.target),
                    targetOffset = this.getOffset(target),
                    rect = target.getBoundingClientRect(),
                    offsetX = event.clientX - rect.left,
                    offsetY = event.clientY - rect.top;
                slider.knob = target.children[0].style;
                slider.left = event.pageX - targetOffset.left - window.pageXOffset + targetOffset.scrollX;
                slider.top = event.pageY - targetOffset.top - window.pageYOffset + targetOffset.scrollY;

                pointer = {
                    left: event.pageX - (offsetX - slider.left),
                    top: event.pageY - (offsetY - slider.top)
                };
            },
            setSaturation: function(event) {
                slider = {
                    maxLeft: 200,
                    maxTop: 200,
                    callLeft: 'setSaturation',
                    callTop: 'setLightness'
                };
                this.setSlider(event);
            },
            setHue: function(event) {
                slider = {
                    maxLeft: 0,
                    maxTop: 200,
                    callLeft: false,
                    callTop: 'setHue'
                };

                this.setSlider(event);
            },
            setAlpha: function(event) {
                slider = {
                    maxLeft: 0,
                    maxTop: 200,
                    callLeft: false,
                    callTop: 'setAlpha'
                };
                this.setSlider(event);
            },
            setKnob: function(top, left) {
                slider.knob.top = top + 'px';
                slider.knob.left = left + 'px';
            }
        };
    })

.directive('colorpicker', ['$document', '$compile', 'colorpicker.language','colorpicker.transColor', 'colorpicker.slider', 'colorpicker.helper', function($document, $compile, $language,Color, Slider, Helper) {
    'use strict';
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            color: '='
        },
        template: '<div class="colorpicker-circle">' +
            '    <div class="circle-inner" ng-style="{\'background-color\':color}"></div>' +
            '</div>',
        link: function($scope, elem, attrs, ngModel) {
            $scope.show = false;
            $scope.colorTab = 1;
            $scope.colorboxs = [
                "rgba(81,167,249,1)",
                "rgba(112,191,65,1)",
                "rgba(245,211,40,1)",
                "rgba(243,144,25,1)",
                "rgba(236,93,87,1)",
                "rgba(179,106,226,1)",
                "rgba(3,101,192,1)",
                "rgba(0,136,43,1)",
                "rgba(220,189,35,1)",
                "rgba(222,106,16,1)",
                "rgba(200,37,6,1)",
                "rgba(119,63,155,1)",
                "rgba(22,79,134,1)",
                "rgba(11,93,24,1)",
                "rgba(195,151,26,1)",
                "rgba(189,91,12,1)",
                "rgba(134,16,1,1)",
                "rgba(95,50,124,1)",
                "rgba(0,36,82,1)",
                "rgba(5,65,9,1)",
                "rgba(163,117,18,1)",
                "rgba(146,70,7,1)",
                "rgba(87,7,6,1)",
                "rgba(59,31,78,1)",
                "rgba(255,255,255,1)",
                "rgba(220,222,224,1)",
                "rgba(166,170,169,1)",
                "rgba(114,114,114,1)",
                "rgba(83,88,95,1)",
                "rgba(0,0,0,1)"
            ];
            $scope.historyColorboxs = [];
            var languageWords = $language[attrs.colorLanguage || "zh-cn"];
            var thisFormat = (attrs.colorType || "hex");
            var cookieName = 'historyColor-' + thisFormat;
            var target = angular.element(document.body);
            /*
            "PALETTE": "经典",
            "WHEEL": "自定义",
            "HISTORY": "历史记录",
            "SELECT": "选择",
            "CANCEL": "取消"
             */
            var template =
                '<div class="colorpicker-mask" ng-show="show" ng-click="select()"></div>' +
                '<div class="colorpicker dropdown" ng-show="show">' +
                '     <div class="colorpicker-preview">' +
                '       <div class="inner">' +
                '       <div class="color-text"></div>' +
                '       <div class="color-tabs">' +
                '        <div class="color-tab" ng-class="{true: \'active\', false: \'\'}[colorTab === 1]" ng-click="toggleTab(1)">'+languageWords["PALETTE"]+'</div>' +
                '        <div class="color-tab" ng-class="{true: \'active\', false: \'\'}[colorTab === 2]" ng-click="toggleTab(2)">'+languageWords["WHEEL"]+'</div>' +
                '        <div class="color-tab" ng-class="{true: \'active\', false: \'\'}[colorTab === 3]" ng-click="toggleTab(3)">'+languageWords["HISTORY"]+'</div>' +
                '       </div>' +
                '       </div>' +
                '     </div>' +
                '     <div class="tab-colorbox" ng-show="colorTab ===1">' +
                '       <div ng-repeat="item in colorboxs">' +
                '          <div class="color-unit" ng-attr-style="background-color:{{::item}}" ng-class="{true:\'active\',false:\'\'}[color === item]" ng-click="selectColorBox(item,$index)"></div>' +
                '       </div>' +
                '     </div>' +
                '     <div class="tab-slider" ng-show="colorTab ===2">' +
                '       <div class="colorpicker-saturation"><i></i></div>' +
                '       <div class="colorpicker-hue"><i></i></div>' +
                '       <div class="colorpicker-alpha"><i></i></div>' +
                '     </div>' +
                '     <div class="tab-historyColorbox" ng-show="colorTab ===3">' +
                '       <div ng-repeat="item in historyColorboxs">' +
                '           <div class="color-unit-wrap">' +
                '               <div class="color-unit" ng-attr-style="background-color:{{::item}}" ng-class="{true:\'active\',false:\'\'}[color === item]" ng-click="selectColorBox(item,$index)"></div>' +
                '           </div>' +
                '       </div>' +
                '     </div>' +
                '     <div class="btn-group">' +
                '        <div class="cancel" ng-click="cancel()">'+languageWords["CANCEL"]+'</div>' +
                '        <div class="select" ng-click="select()">'+languageWords["SELECT"]+'</div>' +
                '     </div>' +
                '     <div class="colorpicker-caret"></div>' +
                '</div>',
                colorpickerTemplate = angular.element(template),
                $mask = colorpickerTemplate.eq(0),
                $colorpicker = colorpickerTemplate.eq(1),
                $sliderHue = $colorpicker.find('.colorpicker-hue'),
                $sliderSaturation = $colorpicker.find('.colorpicker-saturation'),
                $colorpickerPreview = $colorpicker.find('.colorpicker-preview'),
                $pickerColorPointers = $colorpicker.find('i'),
                $colorpickerCaret = $colorpicker.find('.colorpicker-caret');
            $compile(colorpickerTemplate)($scope);
            target.append(colorpickerTemplate);

            var pickerColor = Color;
            var sliderAlpha;
            var lastColor;
            var scrollTimer;
            var historyColorLength = 24;
            var caretPosition;
            $scope.toggleTab = function(tab) {
                $scope.colorTab = tab;
                update();
            };
            $scope.selectColorBox = function(item, index) {
                pickerColor.setColor(item);
                $scope.color = pickerColor[thisFormat]();
                previewColor();
            };
            $scope.cancel = function() {
                $scope.color = lastColor;
                hideColorpickerTemplate("cancel");
            };
            $scope.select = function() {
                hideColorpickerTemplate();
            };
            var bindMouseEvents = function() {
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            };

            if (thisFormat === 'rgba') {
                $colorpicker.addClass('alpha');
                sliderAlpha = $colorpicker.find('.colorpicker-alpha');
                sliderAlpha
                    .on('click', function(event) {
                        Slider.setAlpha(event);
                        mousemove(event);
                    })
                    .on('mousedown', function(event) {
                        Slider.setAlpha(event);
                        bindMouseEvents();
                    });
            }

            $sliderHue
                .on('click', function(event) {
                    Slider.setHue(event);
                    mousemove(event);
                })
                .on('mousedown', function(event) {
                    Slider.setHue(event);
                    bindMouseEvents();
                });

            $sliderSaturation
                .on('click', function(event) {
                    Slider.setSaturation(event);
                    mousemove(event);
                })
                .on('mousedown', function(event) {
                    Slider.setSaturation(event);
                    bindMouseEvents();
                });


            var previewColor = function() {
                var textColor = pickerColor.value.b > 0.5 ? '#000000' : '#FFFFFF';
                var selectedColor = pickerColor[thisFormat]();
                $colorpickerPreview.find('.color-text').text(selectedColor);
                $colorpickerPreview.find('.inner').css('backgroundColor', selectedColor);
                $colorpickerPreview.find('.color-tabs').css('color', textColor);
                $colorpickerPreview.find('.color-text').css('color', textColor);
                $sliderSaturation.css('backgroundColor', pickerColor.toHex(pickerColor.value.h, 1, 1, 1));
                if ($colorpicker.hasClass("position-left") || $colorpicker.hasClass("position-right")) {
                    $colorpickerCaret.css('border-color', selectedColor);
                } else {
                    $colorpickerCaret.css('border-color', "#fff");
                }
            };

            var mousemove = function(event) {
                var left = Slider.getLeftPosition(event),
                    top = Slider.getTopPosition(event),
                    slider = Slider.getSlider();
                Slider.setKnob(top, left);
                if (slider.callLeft) {
                    pickerColor[slider.callLeft].call(pickerColor, left / 200);
                }
                if (slider.callTop) {
                    pickerColor[slider.callTop].call(pickerColor, top / 200);
                }
                previewColor();
                var newColor = pickerColor[thisFormat]();

                $colorpicker.find('.colorpicker-alpha').css({
                    "background-color": newColor
                });
                $scope.$apply(function() {
                    $scope.color = newColor;
                });
                return false;
            };

            var mouseup = function() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            };

            var update = function() {
                var newColor = pickerColor[thisFormat]();
                pickerColor.setColor(newColor);
                $pickerColorPointers.eq(0).css({
                    left: pickerColor.value.s * 200 + 'px',
                    top: 200 - pickerColor.value.b * 200 + 'px'
                });
                $colorpicker.find('.colorpicker-alpha').css({
                    "background-color": newColor
                });
                $pickerColorPointers.eq(1).css('top', 200 * (1 - pickerColor.value.h) + 'px');
                $pickerColorPointers.eq(2).css('top', 200 * (1 - pickerColor.value.a) + 'px');
                previewColor();
            };

            var getColorpickerTemplatePosition = function() {
                var positionValue;
                var colorpickerWidth = $colorpicker.width();
                var colorpickerHeight = $colorpicker.height();
                var positionOfViewport = elem[0].getBoundingClientRect();
                var pageX = positionOfViewport.left;
                var pageY = positionOfViewport.top;
                var winWidth = $(window).width();
                var winHeight = $(window).height();

                $colorpicker.removeClass('position-top');
                $colorpicker.removeClass('position-right');
                $colorpicker.removeClass('position-bottom');
                $colorpicker.removeClass('position-left');

                if (pageX > colorpickerWidth && winHeight - pageY >= colorpickerHeight) {
                    positionValue = {
                        'top': pageY - 6,
                        'left': pageX - colorpickerWidth + 10
                    };
                    $colorpicker.addClass('position-left');
                } else if (pageX < colorpickerWidth && winHeight - pageY >= colorpickerHeight) {
                    positionValue = {
                        'top': pageY - 6,
                        'left': pageX + 20
                    };
                    $colorpicker.addClass('position-right');
                } else if (pageX > colorpickerWidth && winHeight - pageY < colorpickerHeight) {
                    positionValue = {
                        'top': pageY - colorpickerHeight + 35,
                        'left': pageX - colorpickerWidth + 10
                    };
                    $colorpicker.addClass('position-top');
                } else {
                    positionValue = {
                        'top': pageY - colorpickerHeight + 35,
                        'left': pageX + 20
                    };
                    $colorpicker.addClass('position-bottom');
                }

                return {
                    'top': positionValue.top + 'px',
                    'left': positionValue.left + 'px'
                };
            };

            var showColorpickerTemplate = function(event) {
                lastColor = angular.copy($scope.color);
                pickerColor.setColor(lastColor);
                update();
                var cookieColorArr = Helper.getCookie(cookieName);
                cookieColorArr = cookieColorArr === null ? [] : cookieColorArr.split("|");
                $scope.$apply(function() {
                    $scope.show = true;
                    $scope.historyColorboxs = cookieColorArr;
                });
                $colorpicker.css(getColorpickerTemplatePosition());
                $mask.css({
                    'z-index': parseInt(new Date().getTime(), 10)
                });
                $colorpicker.css({
                    'z-index': parseInt(new Date().getTime(), 10)
                });
            };

            elem.on('click', showColorpickerTemplate);

            $colorpicker.on('mousedown', function(event) {
                event.stopPropagation();
                event.preventDefault();
            });
            var hideColorpickerTemplate = function(flag) {
                $scope.show = false;
                if (flag !== "cancel") {
                    setColorCookie();
                }
            };
            var setColorCookie = function() {
                var cookieValue = pickerColor[thisFormat]();
                if (Helper.enabledCookie(cookieName)) {
                    var lastCookieValue = Helper.getCookie(cookieName);
                    var lastCookieArray = lastCookieValue.split("|");
                    for (var i = 0; i < lastCookieArray.length; i++) {
                        if (cookieValue === lastCookieArray[i]) {
                            lastCookieArray.splice(i, 1);
                            lastCookieArray.unshift(cookieValue);
                            Helper.setCookie(cookieName, lastCookieArray.join("|"));
                            return;
                        }
                    }
                    if (lastCookieArray.length >= historyColorLength) {
                        lastCookieArray.pop();
                        lastCookieArray.unshift(cookieValue);
                        Helper.setCookie(cookieName, lastCookieArray.join("|"));
                    } else {
                        Helper.setCookie(cookieName, cookieValue + "|" + lastCookieValue);
                    }
                } else {
                    Helper.setCookie(cookieName, cookieValue);
                }
            };
            //reset colorpicker position
            $document.bind('scroll', function() {
                fixPosition();
            });
            $(window).on('resize', function() {
                fixPosition();
            });

            function fixPosition() {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(function() {
                    $colorpicker.css(getColorpickerTemplatePosition());
                    clearTimeout(scrollTimer);
                }, 100);
            }
        }
    };
}]);
