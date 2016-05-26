'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:confirmDialog
 * @description
 * # confirmDialog
 */
 angular.module('angularModernizrApp')
  .directive('confirmDialog', ['$window','modernizrService', function ($window, modernizrService) {
    return {
      templateUrl: 'templates/confirmdialog.html',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        title: '@',
        visible: '=',
        originalData: '=',
        modifiedCallback: '&',
        confirmClickCallback: '&'
      },
      controller: ['$scope', function($scope) {
        if (!angular.element('link#confirmdialog').length) {
          angular.element('head').append(
            '<link id="confirmdialog" href="styles/confirmdialog.css" rel="stylesheet"/>'
          );
        }
        $scope.confirm = function() {
          if ($scope.confirmClickCallback) {
            modernizrService.callScopedFunction($scope.confirmClickCallback, $scope.$parent);
          }
          $scope.visible = false;
        };
        $scope.cancel = function() {
          $scope.visible = false;
          $scope.modifiedList = null;
          $scope.hideDialog();
        };
        $scope.hideDialog = function() {
          var dialog = angular.element( '#confirm-dialog-'+$scope.$id)[0];
          if (dialog) {
            $(dialog).modal('hide');
            $($(dialog).parent()).off('click');
          }
        };
        $scope.unwnanteTypeList=['accordion', 'container', 'widget'];
        $scope.normalize = function(level, element, original) {
          var normalized = [];
          var res = {};
          res.level = (new Array( level ).join( '  ' ));
          res.key = element.key;
          if (!angular.isArray(element.value)) {
            res.original = original.value;
            res.changed = element.value;
            if ($scope.unwnanteTypeList.indexOf(original.type)<0 && !angular.equals(original.value, element.value)) {
              normalized.push(res);
            }
          }
          else {
            res.original = '<list>';
            res.changed = '<list>';
            if ($scope.unwnanteTypeList.indexOf(original.type)<0 && !angular.equals(original.value, element.value)) {
              normalized.push(res);
            }
            element.value.forEach(function(value) {
              var originalVal = null;
              if (angular.isArray(original.value)) {
                originalVal = original.value.filter(function(originalValue) {
                  return value.key && originalValue.key === value.key;
                })[0];
              }
              if (!originalVal) {
                originalVal = JSON.parse(JSON.stringify(value));
                originalVal.value='';
              }
              normalized = normalized.concat($scope.normalize(level+1, value, originalVal));
            });
          }
          return normalized;
        };
        $scope.modifiedList = null;
        $scope.responseList = function() {
          if (!$scope.modifiedList) {
            $scope.modifiedList = $scope.calculateResponse();
          }
          return $scope.modifiedList||[];
        };
        $scope.calculateResponse = function() {
          //TODO: match the modified and the privious one.
         var responseList = [];
         if ($scope.originalData && $scope.modifiedCallback && $scope.confirmClickCallback) {
           var modifiedData = modernizrService.callScopedFunction($scope.modifiedCallback, $scope.$parent);
           var changes = modifiedData.filter(function(modified) {
             var res = $scope.originalData.filter(function(original) {
               return angular.equals(modified, original);
             });
             return res.length==0;
           });
           var originalChanges = modifiedData.map(function(modified) {
             var res = $scope.originalData.filter(function(original) {
               return angular.equals(modified.key, original.key);
             });
             return res[0];
           });
           changes.forEach(function(result,index) {
             responseList = responseList.concat($scope.normalize(0, result, originalChanges[index]));
           });
         }
         return responseList;
        };

      }],
      link: function(scope, element, attrs, controller/*, transcludeFn*/) {
        scope.$parent.$watch(attrs.visible, function(value) {
          var $ = $window.jQuery;
          var dialog = angular.element( '#confirm-dialog-'+scope.$id)[0];
          if (value && scope.calculateResponse().length>0) {
            if (dialog) {
              scope.visible = true;
              scope.modifiedList = null;
              $(dialog).modal('show');
              $($(dialog).parent()).on('click', function() {
                scope.cancel();
              });
            }
          }
          else {
            scope.visible = false;
          }
        });
      }
    };
  }]);
