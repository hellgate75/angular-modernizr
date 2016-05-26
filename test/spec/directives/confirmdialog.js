'use strict';

describe('Directive: confirmDialog', function () {

  // load the directive's module
  beforeEach(module('angularModernizrApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.modifiedElements = [];
    scope.originalElements = [];
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<confirm-dialog></confirm-dialog>');
    element = $compile(element)(scope);
    // expect(element.text()).toBe('this is the confirmDialog directive');
  }));
});
