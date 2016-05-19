'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:keyValuePair
 * @description
 * # keyValuePair
 */
angular.module('angularModernizrApp')
  .component('keyValuePair', {
    templateUrl: 'templates/keyvaluepair.html',
    transclude: true,
    restrict: 'E',
    bindings: {
      options: '<'
    },
    controller: ['$window', '$scope', function($window, $scope) {
      /* Some init actions */
      // var $ = $window.jQuery;
      if (!angular.element('link#components').length) {
        angular.element('head').append(
          '<link id="components" href="styles/components.css" rel="stylesheet"/>'
        );
      }
      if (!angular.element('link#keyvaluepair').length) {
        angular.element('head').append(
          '<link id="keyvaluepair" href="styles/keyvaluepair.css" rel="stylesheet"/>'
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
      };
      /* Scoped functions*/
      $scope.widgetVisible = true;
      $scope.readOnlyState = true;
      $scope.isReadOnlyMode = function() {
        return this.$ctrl.options.readOnly || $scope.readOnlyState;
      };
      $scope.isPlaneEditMode = function() {
        return !this.$ctrl.options.readOnly && !$scope.readOnlyState && !$scope.isCustomEditMode();
      };
      $scope.isCustomEditMode = function() {
        return !this.$ctrl.options.readOnly && !$scope.readOnlyState && (this.$ctrl.options.type==='boolean');
      };
      $scope.customClass = function() {
        return 'ng-type-' + this.$ctrl.options.type + ' ng-' + $scope.getStateClass();
      };
      $scope.getStateClass = function() {
        if ( this.$ctrl.options.type==='boolean') {
            return !!this.$ctrl.options.value ? 'on' : 'off';
        }
        return 'off';
      };
      $scope.toggleState = function() {
        if ( this.$ctrl.options.type==='boolean') {
            if (typeof this.$ctrl.options.value === 'undefined' || this.$ctrl.options.value===null) {
              this.$ctrl.options.value = true;
            }
            else {
              this.$ctrl.options.value = !this.$ctrl.options.value;
            }
        }
      };
      $scope.visible = function() {
        return $scope.widgetVisible;
      };
      $scope.validate = function(/*event*/) {
      };
      $scope.widgetId= function() {
        var parentId;
        if ($widgetParent && typeof $widgetParent.widgetId === 'function') {
          parentId = $widgetParent.widgetId();
        }
        return (parentId ? parentId + '_' : '') + $scope.$ctrl.options.key;
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
