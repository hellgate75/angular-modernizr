'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:searchBox
 * @description
 * # searchBox
 */
angular.module('angularModernizrApp')
  .directive('searchBox', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element/*, attrs*/) {
        element.text('this is the searchBox directive');
      }
    };
  });
