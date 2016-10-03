angular.module('ui.grid').factory('TableHelper', [function() {
    var Helper = {};
    /*
     *检查是否是时间对象
     */
    Helper.isDate = function(date) {
        return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
    };
    /*
     *转换成时间格式
     *@dateStr 时间戳或标准时间参数
     */
    Helper.newDate = function(dateStr) {
        try {
            if (dateStr && !isNaN(Number(dateStr))) {
                return new Date(Number(dateStr));
            }

        } catch (err) {
            throw new Error(err);
        }
        try {
            //处理 yyyy-mm-dd hh:ii:ss这种非标准格式的日期
            var a = dateStr.split(" ");
            var d = a[0].split("-");
            var result;
            if (a[1]) {
                var t = a[1].split(":");
                result = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
            } else {
                result = new Date(d[0], (d[1] - 1), d[2]);
            }
            return result;
        } catch (err) {
            throw new Error("translate error");
        }
    };
    /*
     *格式化日期
     *@date 时间对象
     *@format yyyy-mm-dd hh:ii:ss
     */
    Helper.format = function(date, format) {
        if (!this.isDate(date)) {
            return "-";
        }
        var date = date;
        var o = {
            "m+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "i+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return format;
    };
    Helper.sort = function(list, key, t, fix) {
        if (!list.length) {
            return list;
        }
        t = t === 'desc' ? 'desc' : 'asc'; // ascending or descending sorting, 默认 升序
        fix = Object.prototype.toString.apply(fix) === '[object Function]' ? fix : function(key) {
            return key;
        };
        switch (Object.prototype.toString.apply(fix.call({}, list[0][key]))) {
            case '[object Number]':
                return list.sort(function(a, b) {
                    return t === 'asc' ? (fix.call({}, a[key]) - fix.call({}, b[key])) : (fix.call({}, b[key]) - fix.call({}, a[key]));
                });
            case '[object String]':
                return list.sort(function(a, b) {
                    return t === 'asc' ? fix.call({}, a[key]).localeCompare(fix.call({}, b[key])) : fix.call({}, b[key]).localeCompare(fix.call({}, a[key]));
                });
            default:
                return list;
        }
    }
    Helper.throttle = function(method, delay) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                method.apply(context, args);
            }, delay);
        }
    };
    Helper.getScrollbarWidth = function() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };
    return Helper;
}]);
