'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:keyValuePair
 * @description
 * # keyValuePair
 */
angular.module('angularModernizrApp')
  .directive('keyValuePair', function() {
    return {
      templateUrl: 'templates/keyvaluepair.html',
      transclude: true,
      restrict: 'E',
      scope: {
        options: '='
      },
      controller: ['$window', '$scope', function($window, $scope) {
        var availableTypes=['text','password','file','password','boolean'];
        if(!$scope.options || availableTypes.indexOf($scope.options.type)<0) {
          throw 'Invalid options or invalid option type for the keyvaluepair widget!!';
        }
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
        $scope.widgetCtrlId = 'ctrl_'+$scope.options.key;
        /* Scoped functions*/
        $scope.widgetVisible = true;
        $scope.readOnlyState = true;
        $scope.isReadOnlyMode = function() {
          return $scope.options.readOnly || $scope.readOnlyState;
        };
        $scope.isPlaneEditMode = function() {
          return !$scope.options.readOnly && !$scope.readOnlyState && !$scope.isCustomEditMode();
        };
        $scope.isCustomEditMode = function() {
          return !$scope.options.readOnly && !$scope.readOnlyState && ($scope.options.type==='boolean');
        };
        $scope.customClass = function() {
          return 'ng-type-' + $scope.options.type + ' ng-' + $scope.getStateClass();
        };
        $scope.getStateClass = function() {
          if ( $scope.options.type==='boolean') {
              return !!$scope.options.value ? 'on' : 'off';
          }
          return 'off';
        };
        $scope.toggleState = function() {
          if ( $scope.options.type==='boolean') {
              if (typeof $scope.options.value === 'undefined' || $scope.options.value===null) {
                $scope.options.value = true;
              }
              else {
                $scope.options.value = !$scope.options.value;
              }
          }
        };
        $scope.visible = function() {
          return $scope.widgetVisible;
        };
        $scope.validate = function(/*event*/) {
        };
        $scope.widgetId= function() {
          return (this.parentId ? this.parentId + '_' : '') + $scope.options.key;
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
          var key = $scope.options.key;
          var value = $scope.options.value;
          var type = $scope.options.type;
          return {
            key: key,
            value: value,
            type: type
          };
        };
        this.setValue = function(value) {
          $scope.options.key = value.key;
          $scope.options.value = value.value;
          $scope.options.type = value.type;
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
