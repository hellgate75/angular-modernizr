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
        if ($widgetParent && typeof $widgetParent.registerWidget === 'function') {
          $widgetParent = $scope && $scope.$parent  && $scope.$parent.$parent ? $scope.$parent.$parent :
          undefined;
        }
      /* Component Init function*/
      this.$onInit = function() {
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
        var parentId;
        if ($widgetParent && typeof $widgetParent.widgetId === 'function') {
          parentId = $widgetParent.widgetId();
        }
        return (parentId ? parentId + '_' : '') + $scope.$ctrl.options.key;
      };
      $scope.widgetsCollection = [];
      $scope.registerWidget = function(widget) {
        if (widget) {
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
        var key = this.$ctrl.options.key;
        var value = this.$ctrl.options.value;
        var type = this.$ctrl.options.type;
        return {
          key: key,
          value: value,
          type: type
        };
      };
      this.setValue = function(value) {
        this.$ctrl.key = value.key;
        this.$ctrl.value = value.value;
        this.$ctrl.type = value.type;
      };
      this.onViewReady = function() {
      };
      this.onReadModeView = function() {
        $scope.readOnlyState = true;
      };
      this.onEditModeView = function() {
        $scope.readOnlyState = false;
      };
      this.show = function() {
        $scope.widgetVisible = true;
      };
      this.hide = function() {
        $scope.widgetVisible = false;
      };
    }]
  });
