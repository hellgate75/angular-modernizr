'use strict';

/**
 * @ngdoc service
 * @name angularspaApp.jsonDataServiceProvider
 * @description
 * # jsonDataServiceProvider
 * Provider in the angularspaApp.
 */
angular.module('angularModernizrApp')
  .provider('modernizrServiceProvider', function() {

    var modernizrService;

    this.$set = function(s) {
      modernizrService = s;
    };

    this.$get = ['modernizrService', function(
      modernizrService) {

      // let's assume that the UnicornLauncher constructor was also changed to
      // accept and use the useTinfoilShielding argument
      return modernizrService;
    }];
  });
