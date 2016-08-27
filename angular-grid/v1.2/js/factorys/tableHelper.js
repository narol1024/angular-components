angular.module('ui.grid').factory('TableHelper', [function() {
    var Helper = {};
    Helper.sort = function(list,key, t, fix) {
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
                    return t === 'asc' ? (fix.call({}, a[key]) - fix.call({}, b[key])) : (fix.call({}, b[key]) - fix.call({}, a[key])); });
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
}])
