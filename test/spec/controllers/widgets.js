'use strict';

describe('Controller: WidgetsCtrl', function() {

  // load the controller's module
  beforeEach(module('angularModernizrApp'));

  var WidgetsctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    WidgetsctrlCtrl = $controller('WidgetsCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    // expect(WidgetsctrlCtrl.awesomeThings.length).toBe(3);
  });
});
