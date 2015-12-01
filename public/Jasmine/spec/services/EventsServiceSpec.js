describe("searchEventsService mocks", function (service) {
    beforeEach(function(){
    	module('AngularApp');
    });

    var service, $httpBackend;
    
    describe('searchEventsService mocks', function () {
    	var resp = window.getJSONFixture('../../../../response.json');
    
    	beforeEach(function () {
            angular.mock.inject(function ($injector) {
                service = $injector.get('EventsService');
                $httpBackend = $injector.get('$httpBackend');
            });
        });
    	
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

    
    /*describe('searchEventsService api calls', function () {
    	
    	beforeEach(function () {
            
    		angular.mock.inject(function ($injector) {
                service = $injector.get('EventsService');
                $httpBackend = $injector.get('$httpBackend');
            });
        });
    	/*it("fetchEvents calls api", inject(function () {
        	var map = {};        	

        	$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue').passThrough();
        	
            service.fetchEvents(map, function (result) {
            	console.log(result);
            	expect(result).not.toBeNull();
            	expect(result.events.length).toBeGreaterThan(0);
            });
            $httpBackend.flush()
            
        }));
        /*
        it("fetchEvents calls api with keyword", inject(function () {
        	var map = {"q": "food"};        	

            $httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&q=food').respond(
                resp
            );
            service.fetchEvents(map, function (result) {
                expect(result).toEqual(resp);
            });
            $httpBackend.flush();
        }));
        
        it("fetchEvents calls api with location", inject(function () {
        	var map = {"location.latitude" : "51.5", "location.longitude" : "-0.12"};        	

            $httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&location.latitude=51.5&location.longitude=-0.12').respond(
                resp
            );
            service.fetchEvents(map, function (result) {
                expect(result).toEqual(resp);
            });
            $httpBackend.flush();
        }));
        
        it("fetchEvents calls api with keyword & location", inject(function () {
        	var map = {"q" : "food" , "location.latitude" : "51.5", "location.longitude" : "-0.12"};        	

            $httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue&q=food&location.latitude=51.5&location.longitude=-0.12').respond(
                resp
            );
            service.fetchEvents(map, function (result) {
                expect(result).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    });*/
    
});


