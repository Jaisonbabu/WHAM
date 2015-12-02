describe("Unit tests for MapService", function (service) {

	beforeEach(function(){module('AngularApp');});

	var service, $httpBackend;
	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			service = $injector.get('MapService');
			$httpBackend = $injector.get('$httpBackend');
		});
	});

	describe('Unit tests for retrieving location based on address', function () {
		--var resp = window.getJSONFixture('../../../../responses/location_for_address_response.json');
		
		it("Unit test to retrieve location based on address", inject(function () {
			var address = "Boston, MA";
			$httpBackend.whenGET('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).respond(
					resp
			);
			service.getLocationForAddress(address, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));
    });
	
	//TODO - error scenarios
});
