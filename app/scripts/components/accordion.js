'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:accordion
 * @description
 * # accordion
 */
angular.module('angularModernizrApp')
  .component('widgetAccordion', {
    templateUrl: 'templates/accordion.html',
    restrict: 'E',
    transclude: true,
    bindings: {
      options: '<'
    },
    controller: ['$window', '$scope', function($window, $scope) {
      // var $ = $window.jQuery;
      if (!angular.element('link#components').length) {
        angular.element('head').append(
          '<link id="components" href="styles/components.css" rel="stylesheet"/>'
        );
      }
      if (!angular.element('link#accordion').length) {
        angular.element('head').append(
          '<link id="accordion" href="styles/accordion.css" rel="stylesheet"/>'
        );
      }
      var $widgetParent = $scope && $scope.$parent ? $scope.$parent :
        undefined;
      /* Component Init function*/
      this.$onInit = function() {
        while($scope.$parent && $widgetParent && typeof $widgetParent.registerWidget !== 'function' && typeof $widgetParent.widgetId !== 'function') {
          if ($widgetParent && typeof $widgetParent.registerWidget === 'function' && typeof $widgetParent.widgetId === 'function' && typeof $widgetParent.widgetId === 'function') {
            $widgetParent = $scope && $scope.$parent  && $scope.$parent.$parent ? $scope.$parent.$parent :
            undefined;
          }
        }
        if ($widgetParent && typeof $widgetParent.registerWidget === 'function') {
          $widgetParent.registerWidget($scope);
        }
        $scope.titleClass = '#' + $scope.widgetId() + ' .ng-accordion-title';
        $scope.titleSelectorClass = '#' + $scope.widgetId() + ' .ng-accordion-selector';
      };
      /* Scoped functions*/
      $scope.widgetVisible = true;
      $scope.readOnlyState = true;
      $scope.visible = function() {
        return $scope.widgetVisible;
      };
      $scope.widgetId= function() {
        return (this.parentId ? this.parentId + '_' : '') + $scope.$ctrl.options.key;
      };
      $scope.widgetsCollection = [];
      $scope.registerWidget = function(widget) {
        if (widget) {
          widget.parentId=$scope.widgetId();
          $scope.$parent=$scope;
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

      $scope.getDomElement = function(domSelector) {
        if (domSelector) {
          return angular.element(domSelector)[0];
        }
        return null;
      };
      $scope.getContentDom = function(domElement) {
        if (domElement) {
          return angular.element('#'+$scope.widgetId() + ' .content')[0];
        }
        return null;
      };
      /* Controller functions*/
      this.getValue = function() {
        var value=[];
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && typeof widget.getValue === 'function') {
            value.push(widget.getValue());
          }
        });
        var key = this.options.key;
        return {
          key: key,
          value: value,
          type: 'widet'
        };
      };
      this.setValue = function(value) {
        if (value && value.type === 'widget' && typeof value.forEach === 'function') {
          value.forEach(function(aValue) {
            if (typeof aValue.key !== 'undefined') {
              var aWidget = $scope.widgetsCollection.filter(function(anyWidget) {
                return anyWidget.$ctrl && anyWidget.$ctrl.options && anyWidget.$ctrl.options.key === aValue.key;
              })[0];
              if (aWidget && typeof aWidget.setValue === 'function') {
                aWidget.setValue(aValue);
              }
            }
          });
        }
      };
      this.onViewReady = function() {
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && typeof widget.onViewReady === 'function') {
            widget.onViewReady();
          }
        });
      };
      this.onReadModeView = function() {
        $scope.readOnlyState = true;
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && typeof widget.onReadModeView === 'function') {
            widget.onReadModeView();
          }
        });
      };
      this.onEditModeView = function() {
        $scope.readOnlyState = false;
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && typeof widget.onEditModeView === 'function') {
            widget.onEditModeView();
          }
        });
      };
      this.show = function() {
        $scope.widgetVisible = true;
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && typeof widget.show === 'function') {
            widget.show();
          }
        });
      };
      this.hide = function() {
        $scope.widgetVisible = false;
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && typeof widget.hide === 'function') {
            widget.hide();
          }
        });
      };
    }]
  });
