describe("searchEventsService mocks", function (service) {

	beforeEach(function(){module('AngularApp');});

	var service, $httpBackend;
	beforeEach(function () {
		angular.mock.inject(function ($injector) {
			service = $injector.get('EventsService');
			$httpBackend = $injector.get('$httpBackend');
		});
	});

	describe('fetchEvents method mocks', function () {
		var resp = window.getJSONFixture('../../../../responses/search_events_response.json');
		
		it("fetchEvents calls api", inject(function () {
			var map = {};        	
			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));

		it("fetchEvents calls api with keyword", inject(function () {
			var map = {"q": "food"};        	

			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&q=food').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));

		it("fetchEvents calls api with location", inject(function () {
			var map = {"location.latitude" : "51.5", "location.longitude" : "-0.12"};        	

			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&location.latitude=51.5&location.longitude=-0.12').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));

		it("fetchEvents calls api with keyword & location", inject(function () {
			var map = {"q" : "food" , "location.latitude" : "51.5", "location.longitude" : "-0.12"};        	

			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&q=food&location.latitude=51.5&location.longitude=-0.12').respond(
					resp
			);
			service.fetchEvents(map, function (result) {
				expect(result.data).toEqual(resp);
			});
			$httpBackend.flush();
		}));
	});

    describe('searchEventsService api calls', function () {
    	var resp = window.getJSONFixture('../../../../responses/event_by_id_response.json');
    	
    	it("fetchEventById calls api", inject(function () {
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
});


