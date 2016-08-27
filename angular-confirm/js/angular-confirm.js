angular.module('ui.confirm', ['ui.bootstrap.modal'])
    .controller('ConfirmModalController', ['$scope', '$uibModalInstance', 'data', function($scope, $uibModalInstance, data) {
        $scope.data = angular.copy(data);

        $scope.ok = function(closeMessage) {
            $uibModalInstance.close(closeMessage);
        };

        $scope.cancel = function(dismissMessage) {
            if (angular.isUndefined(dismissMessage)) {
                dismissMessage = 'cancel';
            }
            $uibModalInstance.dismiss(dismissMessage);
        };

    }])
    .value('$confirmModalDefaults', {
        size: 'md',
        windowClass: 'modal-confirm',
        template: function() {
            var modalHeader = '<div class="modal-header" ng-show="data.confirmTitle"><h3 class="modal-title">{{data.confirmTitle}}</h3></div>';
            var modalBody = '<div class="modal-body"><span class="icon-warning-sign icon"></span><span class="text">{{data.text}}</span></div>';
            var modalFooter = '<div class="modal-footer">' +
                '<button class="btn btn-{{data.confirmOkColor}}" ng-show="data.confirmOk" ng-click="ok()"><span class="icon icon-ok"></span>{{data.confirmOk}}</button>' +
                '<button class="btn btn-{{data.confirmCancelColor}}" ng-show="data.confirmCancel" ng-click="cancel()"><span class="icon icon-reply"></span>{{data.confirmCancel}}</button>' +
                '</div>';
            return modalHeader + modalBody + modalFooter;
        },
        controller: 'ConfirmModalController',
        defaultLabels: {
            confirmOkColor: 'primary',
            confirmTitle:"确认",
            confirmOk:"确定",
            confirmCancelColor: 'default'
        }
    })
    .factory('$confirm', ['$uibModal', '$confirmModalDefaults', function($uibModal, $confirmModalDefaults) {
        return function(data, settings) {
            var defaults = angular.copy($confirmModalDefaults);
            settings = angular.extend(defaults, (settings || {}));
            data = angular.extend({}, settings.defaultLabels, data || {});
            settings.resolve = {
                data: function() {
                    return data;
                }
            };
            return $uibModal.open(settings).result;
        };
    }])
    .directive('confirm', ['$confirm', function($confirm) {
        return {
            priority: 1,
            restrict: 'A',
            scope: {
                ngClick: '&',
                confirm: '@',
                confirmSettings: "=",
                confirmTitle: '@',
                confirmOk: '@',
                confirmOkColor: '@',
                confirmCancel: '@',
                confirmCancelColor: '@'
            },
            link: function(scope, element, attrs) {
                element.unbind("click").bind("click", function($event) {
                    $event.preventDefault();
                    var data = {
                        text: scope.confirm,
                        confirmTitle: scope.confirmTitle,
                        confirmOk:scope.confirmOk,
                        confirmCancel:scope.confirmCancel || false,
                        confirmOkColor:scope.confirmOkColor || 'primary',
                        confirmCancelColor:scope.confirmCancelColor || 'default'
                    };
                    $confirm(data, angular.extend({}, scope.confirmSettings)).then(scope.ngClick);
                });

            }
        }
    }]);