describe("Unit tests for Mapper methods", function (service) {

	beforeEach(function(){module('AngularApp');});

	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			service = $injector.get('Location');
			$httpBackend = $injector.get('$httpBackend');
		});
	});

	describe('Unit tests for Location mappers', function () {
		
		it("Address from API is mapped to location object", inject(function () {
			var resp = window.getJSONFixture('../../../../responses/event_by_id_response.json');
			var address = resp.venue.address;
			var location = getLocation(address);
			expect(location.addressLine1).toEqual(address.address_1);
			expect(location.addressLine2).toEqual(address.address_2);
			expect(location.city).toEqual(address.city);
			expect(location.state).toEqual(address.region);
			expect(location.country).toEqual(address.country);
			expect(location.postal).toEqual(address.postal_code);
		}));
		
		it("Method handles invalid input", function(){
			var location = getLocation(null);
			expect(location).toEqual(new Location());
			
			var location = getLocation(undefined);
			expect(location).toEqual(new Location());
			
			var address = {
					address_1: "360 Huntington Ave",
					address_2: null,
					cities: "Boston",
					postal_code: 02115
			};
			var location = getLocation(address);
			expect(location.addressLine1).toEqual(address.address_1);
			expect(location.addressLine2).toEqual("");
			expect(location.city).toEqual("");
			expect(location.state).toEqual("");
			expect(location.country).toEqual("");
			expect(location.postal).toEqual("02115");
		});
    });
	
	describe("", function(){
		
	});
});
