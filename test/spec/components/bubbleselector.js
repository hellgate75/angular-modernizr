'use strict';

describe('Component: bubbleSelector', function() {

  // load the directive's module
  beforeEach(module('angularModernizrApp'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    var comp = $compile;
    element = null;
    comp = null;
    // element = angular.element('<bubble-selector></bubble-selector>');
    // element = $compile(element)(scope);
    // expect(element.text()).toBe('this is the bubbleSelector directive');
  }));
});
