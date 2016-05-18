'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:bubbleSelector
 * @description
 * # bubbleSelector
 */
angular.module('angularModernizrApp')
  .component('bubbleSelector', {
    templateUrl: 'templates/bubbleselector.html',
    restrict: 'E',
    transclude: true,
    controller: ['$window', '$scope', function($window, $scope) {
      if (!angular.element('link#bubbleselector').length) {
        angular.element('head').append(
          '<link id="bubbleselector" href="styles/bubbleselector.css" rel="stylesheet">'
        );
      }
      this.$onInit = function() {};
      $scope.tabList = [];
      $scope.tabsShown = function() {
        return true; //!!$scope.tabList.length;
      };
      var $commander = $scope.$parent.$parent;
      if ($commander) {
        $commander.updateSyntaxList = function(tabList) {
          $scope.tabList = tabList;
        };
        $scope.onTabClick = function($event, tabId) {
          $event.preventDefault();
          var selected = $scope.tabList.filter(function(element) {
            return element.id === tabId;
          })[0];
          if (selected && typeof $commander.insertText === 'function'
            /*&&
                       selected.enabled*/
          ) {
            $commander.insertText(selected.value);
          }
        };
      }
    }]
  });
