'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:accordion
 * @description
 * # accordion
 */
angular.module('angularModernizrApp')
  .directive('widgetAccordion', ['modernizrService', function(modernizrService) {
    return {
      templateUrl: 'templates/accordion.html',
      restrict: 'E',
      transclude: true,
      scope: {
        options: '='
      },
      controller: ['$window', '$scope', function($window, $scope) {
        if(!$scope.options || $scope.options.type !== 'accordion') {
          throw 'Invalid options or invalid option type for the accordion widget!!';
        }
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
        $scope.widgetCtrlId = 'ctrl_'+$scope.options.key;
        /* Directive Init function*/
        this.$onInit = function() {
          $scope.titleClass = '#' + $scope.widgetId() + ' .ng-accordion-title';
          $scope.titleSelectorClass = '#' + $scope.widgetId() + ' .ng-accordion-selector';
        };
        /* Scoped functions*/
        $scope.widgetVisible = true;
        $scope.readOnlyState = true;
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
            if (widget && widget.$ctrl && typeof widget.$ctrl.getValue === 'function') {
              value.push(widget.$ctrl.getValue());
            }
          });
          var key = $scope.options.key;
          return {
            key: key,
            value: value,
            type: 'accordion'
          };
        };
        this.setValue = function(value) {
          if (value && value.type === 'accordion' && angular.isArray(value.value)) {
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
        /* Widget visibility control scope functions*/
        $scope.show = function() {
          $scope.widgetVisible = true;
        };
        $scope.hide = function() {
          $scope.widgetVisible = false;
        };
        /* Search scope functions*/
        $scope.childrenWidgetCount = function() {
          var childrenCount = 1;
          $scope.widgetsCollection.forEach(function(widget) {
            if (typeof widget.childrenWidgetCount === 'function') {
              childrenCount+=widget.childrenWidgetCount();
            }
            else {
              childrenCount+=1;
            }
          });
          return childrenCount;
        };
        /*
        * The search and filter widgets by some parameters
        * The hidden modified fields are changed the same way as the shown ones
        * @Use (modernizrService)
        * @(function)
        * @(string) keyword - is the field you are filtering for as name of the options keyword
        * @(string) value - is the value you are serching for into the field of named by the keyword
        * @(integer) searchType - is the type of filter to apply :
        *            0 - exact match in the keyword field
        *            1 - starts with the value in the keyword field
        *            2 - ends with the value in the keyword field
        *            3 - contains the value in the keyword field
        *            4 - does not exact match in the keyword field
        *            5 - does not start with the value in the keyword field
        *            6 - does not end with the value in the keyword field
        *            7 - does not contain with the value in the keyword field
        * @(boolean) caseSensitive - is the flag to search the text with or without caps sensitive
        */
        $scope.filter = function(keyword, value, searchType, caseSensitive) {
          var filteredItems = 0;
          var foundLocalMatch = modernizrService.matchFilter($scope.options, keyword, value, searchType, caseSensitive);
          if (foundLocalMatch) {
            filteredItems++;
          }
          $scope.widgetsCollection.forEach(function(widget) {
              if (widget && typeof widget.filter === 'function') {
                if (!widget.filter(keyword, value, searchType)) {
                  filteredItems++;
                }
              }
          });
          var allObscured = (filteredItems===0);
          if (allObscured && !foundLocalMatch) {
            $scope.hide();
          }
          else {
            $scope.show();
          }
          return filteredItems;
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
  }]);
