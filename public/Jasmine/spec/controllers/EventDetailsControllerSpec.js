describe("Unit tests for EventDetailsController", function (service) {

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
        controller = $controller('EventDetailsController', {
            '$scope': scope,
            'DbService': service,
            'EventsService': eventsService,
            '$cookieStore': cookie,
            '$routeParams': { "eventId": eventId}
        });
    }));

	describe('Unit tests for login', function () {
		
		beforeEach(function(){						
			//$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/'+ eventId +'/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue').respond(resp);
			//$httpBackend.whenPOST('/user/details').respond(resp);
			//scope.login({"username": "username", "password": "password"});
			//$httpBackend.flush();
			$httpBackend.whenGET('https://www.eventbriteapi.com/v3/events/'+ eventId +'/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue').respond(eventRes);
			$httpBackend.flush(); 
		});
		
		it("test if valid response is handled", function () {
			  
		    expect(scope.username).toEqual('username');			
		});
	});
	
	/*describe('Unit tests for login handling invalid credentials', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		beforeEach(function(){						
			$httpBackend.whenPOST('/login').respond(1,null);
			scope.login({"username": "1", "password": "password"});
			$httpBackend.flush();
		});
		
		it("test if valid response is handled", function () {
			expect(scope.loginError).toEqual(true);			
		});
	});*/
});