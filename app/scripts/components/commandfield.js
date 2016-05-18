'use strict';

/**
 * @ngdoc directive
 * @name angularModernizrApp.directive:commandField
 * @description
 * # commandField
 */
angular.module('angularModernizrApp')
  .component('commandField', {
    templateUrl: 'templates/commandfield.html',
    restrict: 'E',
    transclude: true,
    bindings: {
      syntaxFilterFunc: '&',
      syntaxValidatorFunc: '&',
      fieldRef: '<'
    },
    controller: ['$window', '$scope', function($window, $scope) {
      var $ = $window.jQuery;
      if (!angular.element('link#commandfield').length) {
        angular.element('head').append(
          '<link id="commandfield" href="styles/commandfield.css" rel="stylesheet">'
        );
      }
      this.$onInit = function() {
        //this.tabsCtrl.addPane(this);
        //console.log(this);
      };
      $scope.focus = function(event) {
        console.log('focus : ' + event);
        $(event.target).addClass('ui-focus');
      };
      $scope.blur = function(event) {
        console.log('blur : ' + event);
        $(event.target).removeClass('ui-focus');
      };
      $scope.keypress = function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          return;
        }
      };
      $scope.validityClass = function() {
        if (typeof this.$ctrl.syntaxValidatorFunc === 'function') {
          if (this.$ctrl.fieldRef.length > 0) {
            var status = this.$ctrl.syntaxValidatorFunc.apply($scope.$parent)
              .call($scope.$parent, {
                value: this.$ctrl.fieldRef.trim()
              });
            return ' ' + (status ? 'valid' : 'invalid');
          }
        }
        return '';
      };
      $scope.keyup = function(event) {
        console.log('keypress : ' + event);
        if (event.keyCode === 13) {
          event.preventDefault();
          return;
        }
        this.$ctrl.fieldRef = $(event.target).html().trim().replace(
          '&nbsp;', ' ');
        if (typeof this.$ctrl.syntaxFilterFunc === 'function' &&
          typeof $scope.updateSyntaxList === 'function') {
          var newList = this.$ctrl.syntaxFilterFunc.apply($scope.$parent)
            .
          call($scope.$parent, {
            searchText: this.$ctrl.fieldRef
          });
          if (typeof newList === 'object' &&
            typeof newList.filter === 'function') {
            $scope.updateSyntaxList(newList);
          }
        }
      };
    }]
  });
