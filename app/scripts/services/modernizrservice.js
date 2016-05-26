'use strict';

/**
 * @ngdoc service
 * @name angularModernizrApp.modernizrService
 * @description
 * # modernizrService
 * Service in the angularModernizrApp.
 */
angular.module('angularModernizrApp')
  .service('modernizrService', function () {
    /*
    * Filter for onject attributes and return the matching state
    * @Whitin (modernizrService)
    * @(function)
    * @(object) options - is the widget to filter configuration options that contains the keywords
    * @(string) keyword - is the field you are filtering for as name of the options keyword
    * @(string) value - is the value you are serching for into the field of named by the keyword
    * @(integer) searchType - is the type of filter to apply :
    *            0 - exact match in the keyword field (default)
    *            1 - starts with the value in the keyword field
    *            2 - ends with the value in the keyword field
    *            3 - contains the value in the keyword field
    *            4 - does not exact match in the keyword field
    *            5 - does not start with the value in the keyword field
    *            6 - does not end with the value in the keyword field
    *            7 - does not contain with the value in the keyword field
    * @(boolean) caseSensitive - is the flag to search the text with or without caps sensitive
    */
    this.matchFilter = function(scopeOptions, keyword, value, searchType, caseSensitive) {
      if (!scopeOptions || (!scopeOptions[keyword] && !value) || value==='') {
        return true;
      }
      // if (!value || !scopeOptions[keyword]) {
      //   return false;
      // }
      var optionsValue = typeof scopeOptions[keyword] !== 'object' ? ''+(!scopeOptions[keyword] ? '' : scopeOptions[keyword]) : '';
      var searchValue = value;

      if (!caseSensitive) {
        optionsValue = optionsValue.toLowerCase();
        searchValue = searchValue.toLowerCase();
      }

      switch (searchType) {
        case 1:
          return optionsValue.indexOf(searchValue)===0;
        case 2:
          return optionsValue.lastIndexOf(searchValue, 0)===optionsValue.length-searchValue.length;
        case 3:
          return optionsValue.indexOf(searchValue, 0)>=0;
        case 4:
          return optionsValue !== searchValue;
        case 5:
          return optionsValue.indexOf(searchValue)!==0;
        case 6:
          return optionsValue.lastIndexOf(searchValue, 0)!==optionsValue.length-searchValue.length;
        case 7:
          return optionsValue.indexOf(searchValue, 0)<0;
        default:
          return optionsValue === searchValue;
      }
    };
    /*
    * Call a scoped function inside a directive from the references function parameters
    * @Whitin (modernizrService)
    * @(function)
    * @(function) fn - function to call
    * @(object) scope - scope to apply as target in the function call
    * @(object) args - object containing the arguments
    */
    this.callScopedFunction = function(fn, scope, args) {
      if (typeof fn === 'function') {
        var applied = fn.apply(scope, args);
        if (applied) {
          return applied.call(scope, args);
        }
        else {
          return fn.call(scope, args);
        }
      }
      return null;
    };
  });
