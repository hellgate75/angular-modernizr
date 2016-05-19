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
      syntaxColorList: '<',
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
      if (this.syntaxColorList && typeof this.syntaxColorList ===
        'object' &&
        this.syntaxColorList.filter === 'function') {
        $scope.syntaxColorList = this.syntaxColorList;
      } else {
        $scope.syntaxColorList = ['red', 'gray', 'cyan', 'navy', 'purple'];
      }
      if (!angular.element('link#commandfield').length) {
        angular.element('head').append(
          '<link id="commandfield" href="styles/commandfield.css" rel="stylesheet">'
        );
      }
      this.$onInit = function() {};
      $scope.focus = function(event) {
        $(event.target).addClass('ui-focus');
        $scope.commandHtmlSelector = $(event.target);
        $scope.getCaret($scope.commandHtmlSelector);
      };
      $scope.blur = function(event) {
        $(event.target).removeClass('ui-focus');
      };
      $scope.colorizeAndFormatHTML = function() {
        var textValue = this.$ctrl.fieldRef;
        var endsWithSpaces = this.$ctrl.fieldRef.match(/ *$/g)[0];
        if (!endsWithSpaces) {
          endsWithSpaces = '';
        }
        var htmlValue = '';
        if (textValue.trim().length) {
          var tokenArray = textValue.split(' ').filter(function(token) {
            return token.length > 0;
          });
          tokenArray.forEach(function(token, index) {
            htmlValue += (index > 0 ? ' ' : '') +
              '<span style="color: ' + $scope.syntaxColorList[index <
                $scope.syntaxColorList.length ? index : $scope.syntaxColorList
                .length - 1] + ';">' + token + '</span>';
          });
          htmlValue += endsWithSpaces.replace(/ /g, '&nbsp;');
        }
        htmlValue = htmlValue;
        $scope.commandHtmlSelector.html(htmlValue);
        $scope.setCaret();
      };
      $scope.insertText = function(text) {
        var value = this.$ctrl.fieldRef;
        var tokens = value.split(' ');
        var htmlValue = '';
        for (var selector = 0; selector < tokens.length - 1; selector++) {
          htmlValue += (selector ? '&nbsp;' : '') + tokens[selector];
        }
        htmlValue += (htmlValue.length ? '&nbsp;' : '') + text +
          '&nbsp;';
        $scope.commandHtmlSelector.html(htmlValue);
        this.$ctrl.fieldRef = htmlValue.replace(/&nbsp;/g, ' ').replace(
          /<.?span(.+?>|>)/g, '');
        $scope.caretPosition = this.$ctrl.fieldRef.length;
        $scope.setCaret();
        $scope.keyup();
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
      var getCaretPosition = function() {
        return window.getSelection().focusOffset || (this.$ctrl && this
          .$ctrl.fieldRef ? this.$ctrl.fieldRef
          .length : this.fieldRef.length);
      }.bind(this);
      var setCaretPosition = function(editableDiv, position) {
        editableDiv.focus();
        var range = document.createRange();

        range.setStart(editableDiv[0].childNodes[0], position);
        range.setEnd(editableDiv[0].childNodes[0], position);
        range.collapse(false);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      };
      $scope.getCaret = function() {
        $scope.caretPosition = getCaretPosition($scope.commandHtmlSelector);
        //console.log('get: ' + $scope.caretPosition);
      };
      $scope.setCaret = function() {
        setCaretPosition($scope.commandHtmlSelector, $scope.caretPosition);
        //console.log('set: ' + $scope.caretPosition);
      };
      $scope.keyup = function(event) {
        $scope.getCaret();
        if (event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            return;
          }
          this.$ctrl.fieldRef = $(event.target).html().replace(
            /&nbsp;/g, ' ').replace(/<.?span(.+?>|>)/g, '');
        }
        //$scope.colorizeAndFormatHTML();
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
