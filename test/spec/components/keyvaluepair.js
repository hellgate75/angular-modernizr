'use strict';

describe('Component: keyValuePair', function() {

  // load the directive's module
  beforeEach(module('angularModernizrApp'));

  var /*element,*/
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function(/*$compile*/) {
    // element = angular.element('<key-value-pair></key-value-pair>');
    // element = $compile(element)(scope);
    // expect(element.text()).toBe('this is the keyValuePair directive');
  }));
});
