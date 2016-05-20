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
      title: 'Accordion 1 - Collapsed',
      expanded: false
    };
    $scope.accordion2 = {
      key: 'ngInAccordion2',
      title: 'Accordion 2 - Expanded',
      expanded: true
    };
    $scope.mainContainer = {
      key: 'mainContainer'
    };
    $scope.allOptions = [$scope.mainContainer, $scope.singleStringField, $scope.singleROStringField, $scope.singleAccordionStringField1, $scope.singleAccordionStringField2, $scope.accordion1, $scope.accordion2];
    $scope.allOptionsBackup = JSON.parse(JSON.stringify($scope.allOptions));
    $scope.widgetId= function() {
      return undefined;
    };
    $scope.widgetsCollection = [];
    $scope.registerWidget = function(widget) {
      if (widget) {
        widget.parentId=$scope.widgetId();
        $scope.widgetsCollection.push(widget);
        if (widget && widget.$ctrl && typeof widget.$ctrl.onViewReady === 'function') {
          widget.$ctrl.onViewReady();
        }
      }
    };
    $scope.widgetId= function() {
      return null;
    };
    $scope.editMode=false;
    $scope.saved=false;
    $scope.stateChangeText = 'Edit Mode';
    $scope.saveForm = function() {
      $scope.saved=true;
      $scope.widgetsCollection.forEach(function(widget) {
        if (widget && widget.$ctrl && typeof widget.$ctrl.getValue === 'function' && typeof widget.$ctrl.setValue === 'function') {
          var value = widget.$ctrl.getValue();
          if (typeof value.value === 'string' && value.value.indexOf('SAVED: ')!==0) {
            value.value = 'SAVED: ' + value.value;
          }
          widget.$ctrl.setValue(value);
        }
      });
      $scope.toggleState();
    };
    $scope.reload = function() {
      $scope.widgetsCollection.forEach(function(widget) {
        if (widget && widget.$ctrl && typeof widget.$ctrl.getValue === 'function' && typeof widget.$ctrl.setValue === 'function') {
          var value = $scope.allOptionsBackup.filter(function(aValue) { return aValue.key === widget.$ctrl.options.key && aValue.value;})[0];
          if (value) {
            widget.$ctrl.setValue(value);
          }
        }
      });
    };
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
