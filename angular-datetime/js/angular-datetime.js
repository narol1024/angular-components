angular.module("ngDatetime", [])
    .factory('dateTimeFactory', [function() {
        var DateTime = {};
        DateTime._checkDateValid = function(date) {
            if (Object.prototype.toString.call(date) === "[object Date]") {
                // it is a date
                if (isNaN(date.getTime())) { // d.valueOf() could also work
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };
        DateTime.newDate = function(dateStr) {
            if (dateStr === "" || dateStr === null) {
                throw new Error("时间为空时，不允许格式化");
            }
            if (angular.isNumber(Number(dateStr)) && !angular.equals(NaN, Number(dateStr))) {
                try {
                    return new Date(Number(dateStr));
                } catch (err) {

                }
            }
            var a = dateStr.split(" ");
            var d = a[0].split("-");
            if (a[1]) {
                var t = a[1].split(":");
                return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
            } else {
                return new Date(d[0], (d[1] - 1), d[2]);
            }
        };
        /*格式化日期
          @date new Date()
          format yyyy-mm-dd hh:ii:ss
        */
        DateTime.format = function(date, format) {
            if(!this._checkDateValid(date)){
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
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return format;
        };
        /*
        获取某日期的前后n天
         */
        DateTime.getDate = function(date, dayCount) {
            var dateCopy = angular.copy(date);
            dateCopy.setDate(dateCopy.getDate() + dayCount); //获取dayCount天后的日期
            return dateCopy;
        };
        /**
         * 获取上一个月
         *
         * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
         */
        DateTime.getPreMonth = function(date) {
            date = this.format(date, 'yyyy-mm-dd');
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        };

        /**
         * 获取下一个月
         *
         * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
         */
        DateTime.getNextMonth = function(date) {
            date = this.format(date, 'yyyy-mm-dd');
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中的月的天数
            var year2 = year;
            var month2 = parseInt(month) + 1;
            if (month2 == 13) {
                year2 = parseInt(year2) + 1;
                month2 = 1;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }

            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        };
        return DateTime;
    }]);
