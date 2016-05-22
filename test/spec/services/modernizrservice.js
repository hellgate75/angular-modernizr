'use strict';

describe('Service: modernizrService', function () {

  // load the service's module
  beforeEach(module('angularModernizrApp'));

  // instantiate service
  var modernizrService;
  beforeEach(inject(function (_modernizrService_) {
    modernizrService = _modernizrService_;
  }));

  it('should do something', function () {
    expect(!!modernizrService).toBe(true);
  });

});
