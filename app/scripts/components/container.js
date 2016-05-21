'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:container,
 * @description
 * # container
 */
angular.module('angularModernizrApp')
  .directive('widgetContainer', function() {
    return {
      templateUrl: 'templates/container.html',
      transclude: true,
      restrict: 'E',
      scope: {
        options: '='
      },
      controller: ['$window', '$scope', function($window, $scope) {
        if(!$scope.options || $scope.options.type !== 'container') {
          throw 'Invalid options or invalid option type for the container widget!!';
        }
        // var $ = $window.jQuery;
        if (!angular.element('link#components').length) {
          angular.element('head').append(
            '<link id="components" href="styles/components.css" rel="stylesheet"/>'
          );
        }
        if (!angular.element('link#container').length) {
          angular.element('head').append(
            '<link id="container" href="styles/container.css" rel="stylesheet"/>'
          );
        }
        $scope.widgetCtrlId = 'ctrl_'+$scope.options.key;
        /* Scoped functions*/
        $scope.widgetVisible = true;
        $scope.readOnlyState = true;
        $scope.visible = function() {
          return $scope.widgetVisible;
        };
        $scope.widgetId= function() {
          return (this.parentId ? this.parentId + '_' : '') + $scope.options.key;
        };
        $scope.widgetsCollection = [];
        $scope.registerWidget = function(widget) {
          if (widget) {
            widget.parentId=$scope.widgetId();
            $scope.widgetsCollection.push(widget);
             if (widget && widget.$ctrl && typeof widget.$ctrl.onViewReady === 'function') {
               widget.$ctrl.onViewReady();
            }
          }
        };
        $scope.attachTo = function(domElement) {
          if (domElement) {
            var widgetDomHandler = angular.element('#'+$scope.widgetId())[0];
            if (widgetDomHandler) {
              angular.element(domElement).append(widgetDomHandler);
            }
          }
        };
        $scope.getContentDom = function(domElement) {
          if (domElement) {
            return angular.element('#'+$scope.widgetId() + ' .content')[0];
          }
        };
        /* Controller functions*/
        this.getValue = function() {
          var value=[];
          $scope.widgetsCollection.forEach(function(widget) {
            if (widget && widget.$ctrl && typeof widget.$ctrl.getValue === 'function') {
              value.push(widget.$ctrl.getValue());
            }
          });
          var key = $scope.options.key;
          return {
            key: key,
            value: value,
            type: 'container'
          };
        };
        this.setValue = function(value) {
          if (value && value.type === 'container' && angular.isArray(value.value)) {
            value.value.forEach(function(aValue) {
              if (typeof aValue.key !== 'undefined') {
                var aWidget = $scope.widgetsCollection.filter(function(anyWidget) {
                  return anyWidget.$ctrl && anyWidget.options && anyWidget.options.key === aValue.key;
                })[0];
                if (aWidget && aWidget.$ctrl && typeof aWidget.$ctrl.setValue === 'function') {
                  aWidget.$ctrl.setValue(aValue);
                }
              }
            });
          }
        };
        this.onViewReady = function() {
          $scope.widgetsCollection.forEach(function(widget) {
            if (widget && widget.$ctrl && typeof widget.$ctrl.onViewReady === 'function') {
              widget.$ctrl.onViewReady();
            }
          });
        };
        this.onReadModeView = function() {
          $scope.readOnlyState = true;
          $scope.widgetsCollection.forEach(function(widget) {
            if (widget && widget.$ctrl && typeof widget.$ctrl.onReadModeView === 'function') {
              widget.$ctrl.onReadModeView();
            }
          });
        };
        this.onEditModeView = function() {
          $scope.readOnlyState = false;
          $scope.widgetsCollection.forEach(function(widget) {
            if (widget && widget.$ctrl && typeof widget.$ctrl.onEditModeView === 'function') {
              widget.$ctrl.onEditModeView();
            }
          });
        };
        this.show = function() {
          $scope.widgetVisible = true;
          $scope.widgetsCollection.forEach(function(widget) {
            if (widget && widget.$ctrl && typeof widget.$ctrl.show === 'function') {
              widget.$ctrl.show();
            }
          });
        };
        this.hide = function() {
          $scope.widgetVisible = false;
          $scope.widgetsCollection.forEach(function(widget) {
            if (widget && widget.$ctrl && typeof widget.$ctrl.hide === 'function') {
              widget.$ctrl.hide();
            }
          });
        };
      }],
      controllerAs: '$ctrl',
      link: function link(scope/*, element, attrs, controller, transcludeFn*/) {
        scope.$widgetParent = null;
        /* Component Init function*/
        var currParent = scope.$parent;
        var resolved = false;
        while(currParent && !resolved) {
          if (currParent && typeof currParent.registerWidget === 'function') {
            if (scope.$widgetParent && scope.$widgetParent.widgetCtrlId === currParent.widgetCtrlId) {
              resolved=true;
            }
            scope.$widgetParent = currParent;
          }
          if (currParent) {
            currParent = currParent.$parent;
          }
        }
        if (scope.$widgetParent && typeof scope.$widgetParent.registerWidget === 'function') {
          scope.$widgetParent.registerWidget(scope);
        }
      }
    };
  });
