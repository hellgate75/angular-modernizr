'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:searchBox
 * @description
 * # searchBox
 */
angular.module('angularModernizrApp')
  .directive('searchBox', ['$timeout', function ($timeout) {
    return {
      templateUrl: 'templates/searchbox.html',
      restrict: 'E',
      scope: {
        filterFn: '&filterFunction',
        filteredWidgets: '=',
        totalWidgets: '=',
        filterTextModel: '='
      },
      transclude: true,
      controller : ['$scope', function($scope) {
        if (!angular.element('link#searchbox').length) {
          angular.element('head').append(
            '<link id="searchbox" href="styles/searchbox.css" rel="stylesheet"/>'
          );
        }
        $scope.attributeList = [{key: 'key', value: 'Option Key'}, {key: 'value', value: 'Option Value'}];
        $scope.searchTypeList = [{key: 0, value: 'Exact Search'}, {key: 1, value: 'Starts With'}, {key: 2, value: 'Ends With'}, {key: 3, value: 'Contains Value'},
                              {key: 4, value: 'Not Equals To'}, {key: 5, value: 'Doesn\'t Start With'}, {key: 2, value: 'Doesn\'t End With'}, {key: 3, value: 'Doesn\'t Contain Value'}];
        $scope.searchAttribute = $scope.attributeList[0].key;
        $scope.searchType = $scope.searchTypeList[0].key;

        $scope.setCurrentAttributeValue = function(key) {
          var currentAttribute = $scope.attributeList.filter(function(attribute) {
            return attribute.key === key;
          })[0];
          if (currentAttribute) {
            var element = angular.element('#btn-search-field-' + $scope.$id)[0];
            if (element) {
              element.innerHTML=currentAttribute.value+'<span class="caret"></span>';
            }
          }
        };
        $scope.setCurrentSearchTypeValue = function(key) {
          var currentSearchType = $scope.searchTypeList.filter(function(attribute) {
            return attribute.key === key;
          })[0];
          if (currentSearchType) {
            var element = angular.element('#btn-search-type-' + $scope.$id)[0];
            if (element) {
              element.innerHTML=currentSearchType.value+'<span class="caret"></span>';
            }
          }
        };
        $scope.onAttributeChange = function(value) {
          $scope.searchAttribute = value;
          $scope.setCurrentAttributeValue($scope.searchAttribute);
          $scope.filterFormElements();
        };
        $scope.onSearchTypeChange = function(value) {
          $scope.searchType = value;
          $scope.setCurrentSearchTypeValue($scope.searchType);
          $scope.filterFormElements();
        };
        $scope.total = function() {
          return $scope.totalWidgets;
        };
        $scope.filtered = function() {
          return $scope.filteredWidgets;
        };
        $scope.showMessages = function() {
          return $scope.filterTextModel !== '';
        };
        $scope.filterFormElements = function() {
          var request = {keyword:$scope.searchAttribute,value:$scope.filterTextModel,type:$scope.searchType,caseSensitive:false};
          $scope.filterFn.apply($scope, request).call($scope, request);
        };
        $scope.keyup = function(event) {
          $scope.filterTextModel = event.target.value;
          $scope.filterFormElements();
        };
        $scope.keypress = function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            return;
          }
        };

      }],
      controllerAs: '$ctrl',
      link: function postLink(scope/*, element, attrs*/) {
        $timeout(function() {
          scope.setCurrentAttributeValue(scope.searchAttribute);
          scope.setCurrentSearchTypeValue(scope.searchType);
        }, 1000);
      }
    };
  }]);
