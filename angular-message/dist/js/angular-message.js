angular.module('ui.message', [])
.factory('$messageFactory', [function() {
    var Message = {};
    var timer;
    var messageTypes = [
        {type:"success"},
        {type:"error"},
        {type:"loading"},
        {type:"warning"}
    ];
    var messageId;
    Message.removeMessage = function() {
        $('#ui-message-mask-'+messageId).remove();
        $('#ui-message-'+messageId).remove();
    }
    Message.slideUpMessage = function(){
        var _this = this;
        var $message = $('#ui-message-'+messageId);
        $message.animate({
            top:-$message.outerHeight()
        },200,'swing',function(){
            _this.removeMessage();
        });
    }
    Message.popMessage = function(options) {
        var _this = this;
        this.removeMessage();
        messageId = (((1 + Math.random()) * new Date().getTime()) | 0).toString(16).substring(1);
        if (options.mask) {
            var maskTemplate = angular.element("<div class='ui-message-mask' id='ui-message-mask-"+messageId+"'></div>");
            maskTemplate.css('z-index',messageId);
            angular.element(document.body).append(maskTemplate);
        }
        var tipsTemplate = angular.element("<div class='ui-message' id='ui-message-"+messageId+"'>" +options.message + '</div>');
        angular.element(document.body).append(tipsTemplate);
        var currenyItem = messageTypes[options.type || 0] || messageTypes[0];
        $(tipsTemplate).css({
            'z-index': new Date().getTime(),
            'marginLeft': -$(tipsTemplate).outerWidth() / 2
        }).addClass(currenyItem.type);
        if (options.time) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                if (angular.isFunction(options.callback)) {
                    options.callback();
                }
                _this.slideUpMessage();
                clearTimeout(timer);
            }, options.time);
        }
    };
    return Message;
}]);
