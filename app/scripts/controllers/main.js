'use strict';

/**
 * @ngdoc function
 * @name angularModernizrApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularModernizrApp
 */
angular.module('angularModernizrApp')
  .controller('MainCtrl', ['$scope', function($scope) {
    $scope.inputValue = '';
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
