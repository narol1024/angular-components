angular.module('ui.grid').filter('tableCellTrans', ["TableHelper", function(TableHelper) {
    return function(text, param) {
        var isNull = text === null || text === "";
        if (param.transValue) {
            var transValue;
            if (angular.isFunction(param.transValue)) {
                var tempObject = param.transValue();
                var transObject = {};
                var map = tempObject.list;
                var key = tempObject.key;
                var value = tempObject.value;
                for (var i = 0; i < map.length; i++) {
                    transObject[map[i][key]] = map[i][value];
                }
                transValue = transObject[text];
            } else {
                transValue = param.transValue[text];
            }
            text = transValue || "-";
        }
        if (param.formatDate) {
            try {
                text = TableHelper.format(TableHelper.newDate(text), param.formatDate);
            } catch (err) {
                text = "-";
            }
        }
        if (param.toFixed) {
            try {
                if (angular.isNumber(Number(text)) && !angular.equals(NaN, Number(text))) {
                    text = Number(text).toFixed(param.toFixed);
                } else {
                    text = "-";
                }

            } catch (err) {
                console.log(err);
            }
        }
        if (param.unitText) {
            text = text + param.unitText.toString();
        }
        return isNull ? "-" : text;
    };
}]);
