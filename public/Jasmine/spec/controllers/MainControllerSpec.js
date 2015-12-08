describe("Unit tests for MainController", function (service) {

	var controller, scope, rootScope, $httpBackend, dbService, eventsService, cookie, compile;
	var resp = window.getJSONFixture('../../../../responses/userResponse.json');
	var eventRes = window.getJSONFixture('../../../../responses/event_by_id_response.json');
	var eventId = "18045288945";
	
	beforeEach(function(){
		module('AngularApp');		
	});
	
	beforeEach(inject(function ($injector, $rootScope, $controller, $cookieStore, $compile) {
		dbService = $injector.get('DbService');
		eventsService = $injector.get('EventsService');
        $httpBackend = $injector.get('$httpBackend');
		scope = $rootScope.$new();
        rootScope = $rootScope;
        cookie = $cookieStore;
        scope.event = eventRes;
        compile = $compile;
        cookie.put('username','username');
        cookie.put('userLoc', new google.maps.LatLng("42.338", "-71.08"));
        cookie.put('userDetails', resp);
        var html = '<div id="eventMap"></div>';
	    elem = angular.element(html);  // turn html into an element object	    
	    $("body").append(compile(html)(scope));
        controller = $controller('MainController', {
            '$scope': scope,
            'DbService': service,
            'EventsService': eventsService,
            '$cookieStore': cookie,
            '$routeParams': { "eventId": eventId}
        });
        location = "360 Huntington Avenue Boston MA";
    }));

	describe('Unit tests for login', function () {
		
		beforeEach(function(){						
			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/'+ eventId +'/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue').respond(eventRes);
			$httpBackend.flush(); 
			//scope.searchEventsCurrentLoc();
		});
		
		it("test if valid response is handled", function () {
			  
		});
	});
});