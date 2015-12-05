describe("Unit tests for EventsService", function (service) {

	beforeEach(function(){module('AngularApp');});

	var service, $httpBackend;
	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			service = $injector.get('EventsService');
			$httpBackend = $injector.get('$httpBackend');
		});
	});

	describe('Unit tests for search events', function () {
		var resp = window.getJSONFixture('../../../../responses/search_events_response.json');
		
		it("Unit test for search event api call", inject(function () {
			var map = {};        	
			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&sort_by=date').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));

		it("Unit test for search event api call with keyword", inject(function () {
			var map = {"q": "food"};        	

			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&sort_by=date&q=food').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));

		it("Unit test for search event api call with location", inject(function () {
			var map = {"location.latitude" : "51.5", "location.longitude" : "-0.12"};        	

			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&sort_by=date&location.latitude=51.5&location.longitude=-0.12').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));

		it("Unit test for search event api call with keyword & location", inject(function () {
			var map = {"q" : "food" , "location.latitude" : "51.5", "location.longitude" : "-0.12"};        	

			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&sort_by=date&q=food&location.latitude=51.5&location.longitude=-0.12').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));
	});

    describe('Unit tests for searching events based on event id', function () {
    	var resp = window.getJSONFixture('../../../../responses/event_by_id_response.json');
    	
    	it("Unit test to search for an event based on its id", inject(function () {
        	var eventId = '18045288945';

        	$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/'+eventId+'/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue').respond(
        			resp
        	);
            service.fetchEventById(eventId, function (result) {
            	expect(result.data).toEqual(resp);
            });
            $httpBackend.flush()
        }));
    });
    
    //TODO: error scenarios - both methods
});


