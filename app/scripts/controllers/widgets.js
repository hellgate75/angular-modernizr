'use strict';

/**
 * @ngdoc function
 * @name angularModernizrApp.controller:WidgetsctrlCtrl
 * @description
 * # WidgetsctrlCtrl
 * Controller of the angularModernizrApp
 */
angular.module('angularModernizrApp')
  .controller('WidgetsCtrl', [ '$scope',
  function($scope) {
    $scope.singleStringField = {
      key: 'ngStringAttrbute',
      value: 'my editable text',
      type: 'text',
      readOnly: false
    };
    $scope.singleROStringField = {
      key: 'ngReadOnlyStringAttrbute',
      value: 'my readonly text',
      type: 'text',
      readOnly: true
    };
    $scope.singleAccordionStringField1 = {
      key: 'ngInAccordionStringAttrbute',
      value: 'my editable in accordion text',
      type: 'text',
      readOnly: false
    };
    $scope.singleAccordionStringField2 = {
      key: 'ngInAccordionStringAttrbute2',
      value: 'my readonly in accordion text',
      type: 'text',
      readOnly: true
    };
    $scope.accordion1 = {
      key: 'ngInAccordion1',
      title: 'Accordion 2 - Collapsed',
      expanded: false
    };
    $scope.accordion2 = {
      key: 'ngInAccordion2',
      title: 'Accordion 2 - Expanded',
      expanded: true
    };
    $scope.widgetId= function() {
      return undefined;
    };
    $scope.widgetsCollection = [];
    $scope.registerWidget = function(widget) {
      if (widget) {
        $scope.widgetsCollection.push(widget);
        if (widget && widget.$ctrl && typeof widget.$ctrl.onViewReady === 'function') {
          widget.$ctrl.onViewReady();
        }
      }
    };
    $scope.editMode=false;
    $scope.stateChangeText = 'Edit Mode';
    $scope.toggleState = function() {
      $scope.editMode = !$scope.editMode;
      if ($scope.editMode) {
        $scope.stateChangeText = 'View Mode';
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && widget.$ctrl && typeof widget.$ctrl.onEditModeView === 'function') {
            widget.$ctrl.onEditModeView();
          }
        });
      }
      else {
        $scope.stateChangeText = 'Edit Mode';
        $scope.widgetsCollection.forEach(function(widget) {
          if (widget && widget.$ctrl && typeof widget.$ctrl.onReadModeView === 'function') {
            widget.$ctrl.onReadModeView();
          }
        });
      }
    };
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
