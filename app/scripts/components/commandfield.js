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
      emptyFieldMessage: '@',
      incompleteFieldMessage: '@',
      fieldRef: '<'
    },
    controller: ['$window', '$scope', function($window, $scope) {
      var $ = $window.jQuery;
      $scope.messageVisible = false;
      $scope.elementValid = false;
      $scope.emptyFieldStatus = true;
      if (!angular.element('link#commandfield').length) {
        angular.element('head').append(
          '<link id="commandfield" href="styles/commandfield.css" rel="stylesheet">'
        );
      }
      this.$onInit = function() {};
      $scope.focus = function(event) {
        $(event.target).addClass('ui-focus');
        $scope.commandHtmlSelector = $(event.target);
      };
      $scope.blur = function(event) {
        $(event.target).removeClass('ui-focus');
      };
      $scope.insertText = function(text) {
        var value = this.$ctrl.fieldRef;
        var tokens = value.split(' ');
        //.
        // filter(function(token) {
        //   return token.length > 0;
        // });
        var htmlValue = '';
        for (var selector = 0; selector < tokens.length - 1; selector++) {
          htmlValue += (selector ? '&nbsp;' : '') + tokens[selector];
        }
        htmlValue += (htmlValue.length ? '&nbsp;' : '') + text +
          '&nbsp;';
        $scope.commandHtmlSelector.html(htmlValue);
        this.$ctrl.fieldRef = htmlValue.replace(/&nbsp;/g, ' ');
        if (typeof this.$ctrl.syntaxFilterFunc === 'function' &&
          typeof $scope.updateSyntaxList === 'function' &&
          this.$ctrl.fieldRef.length > 0) {
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
        if (!this.$ctrl.fieldRef.length) {
          $scope.messageVisible = false;
          $scope.emptyFieldStatus = true;
        }
      };
      $scope.validityClass = function() {
        $scope.elementValid = false;
        $scope.emptyFieldStatus = false;
        if (typeof this.$ctrl.syntaxValidatorFunc === 'function') {
          if (this.$ctrl.fieldRef.length > 0) {
            var status = this.$ctrl.syntaxValidatorFunc.apply($scope.$parent)
              .call($scope.$parent, {
                value: this.$ctrl.fieldRef
              });
            $scope.elementValid = status;
            return ' ' + (status ? 'valid' : 'invalid');
          } else {
            $scope.emptyFieldStatus = true;
          }
        }
        return '';
      };
      $scope.keypress = function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          return;
        }
      };
      $scope.keyup = function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          return;
        }
        this.$ctrl.fieldRef = $(event.target).html().replace(
          /&nbsp;/g, ' ');
        if (typeof this.$ctrl.syntaxFilterFunc === 'function' &&
          typeof $scope.updateSyntaxList === 'function' &&
          this.$ctrl.fieldRef.length > 0) {
          var newList = this.$ctrl.syntaxFilterFunc.apply($scope.$parent)
            .
          call($scope.$parent, {
            searchText: this.$ctrl.fieldRef
          });
          $scope.messageVisible = true;
          $scope.emptyFieldStatus = false;
          if (typeof newList === 'object' &&
            typeof newList.filter === 'function') {
            $scope.updateSyntaxList(newList);
            $scope.messageVisible = !newList.length;
            $scope.emptyFieldStatus = false;
          }
        }
        if (this.$ctrl.fieldRef.length === 0 &&
          typeof $scope.updateSyntaxList === 'function') {
          $scope.messageVisible = false;
          $scope.emptyFieldStatus = true;
          $scope.updateSyntaxList([]);
        }
      };
    }]
  });
