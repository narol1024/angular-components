angular.module("ngDatetime", [])
    .factory('dateTimeFactory', [function() {
        var DateTime = {};
        /*
        *检查是否是时间对象
        */
        DateTime.isDate = function(date) {
            return Object.prototype.toString.call(date) === "[object Date]";
        };
        /*
        *转换成时间格式
        *@dateStr 时间戳或标准时间参数
        */
        DateTime.newDate = function(dateStr) {
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
                if (a[1]) {
                    var t = a[1].split(":");
                    return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
                } else {
                    return new Date(d[0], (d[1] - 1), d[2]);
                }
            } catch (err) {
                throw new Error("translate error");
            }
        };
        /*
        *格式化日期
        *@date 时间对象
        *@format yyyy-mm-dd hh:ii:ss
        */
        DateTime.format = function(date, format) {
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
        /*
        *获取某日期的前后count天
        *@date 时间对象
        *@count 前后count天，正数为当前时间之后，负数为当前时间之前
        *@format 格式化时间
         */
        DateTime.getSomeDate = function(date, count,format) {
            var thisDate = this.newDate(date);
            if (this.isDate(thisDate)) {
                var dateCopy = angular.copy(thisDate);
                dateCopy.setDate(dateCopy.getDate() + count);
                return format ? this.format(dateCopy, format) : dateCopy;
            } else {
                return "-";
            }
        };
        /*
        * 获取某日期的前后count月
        *@date 时间对象
        *@count 前后count月，正数为当前时间之后，负数为当前时间之前
        *@format 格式化时间
         */
        DateTime.getSomeMonth = function(date, count, format) {
            var thisDate = this.newDate(date);
            if (this.isDate(thisDate)) {
                var dateCopy = angular.copy(thisDate);
                dateCopy.setMonth(dateCopy.getMonth() + count);
                return format ? this.format(dateCopy, format) : dateCopy;
            } else {
                return "-";
            }
        };
        return DateTime;
    }]);
