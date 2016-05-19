'use strict';

/**
 * @ngdoc function
 * @name angularspaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller that provide the user interface the main features exposer by the Users controller. It provide in the scope
 * functions and variable used by other elements : directives and components.
 */

angular.module('angularModernizrApp').controller(
  'NavBarCtrl', ['$scope',
    function($scope) {
      $scope.aboutClass = '';
      $scope.mainClass = 'active';
      $scope.widgetsClass = '';
      $scope.contactsClass = '';
      $scope.switchToMain = function() {
        $scope.aboutClass = '';
        $scope.widgetsClass = '';
        $scope.mainClass = 'active';
      };
      $scope.switchToWidgets = function() {
        $scope.aboutClass = '';
        $scope.widgetsClass = 'active';
        $scope.mainClass = '';
      };
      $scope.switchToAbout = function() {
        $scope.aboutClass = 'active';
        $scope.widgetsClass = '';
        $scope.mainClass = '';
      };
      // console.log(window.location.href);
      if (window.location.href.indexOf('/widgets')>0) {
        $scope.switchToWidgets();
      }
      if (window.location.href.indexOf('/about')>0) {
        $scope.switchToAbout();
      }
    }
  ]);
