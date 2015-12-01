describe("userEventsService mocks", function (service) {
    beforeEach(function(){module('AngularApp')});

    var service, $httpBackend;
    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            service = $injector.get('DbService');
            $httpBackend = $injector.get('$httpBackend');
        });
    });
    
    describe('userDbService mocks', function () {
    	var resp = window.getJSONFixture('../../../../userResponse.json');
        
    	it("fetchEvents calls api", inject(function () {
        	var userCredentials = {};        	

            $httpBackend.whenGET('/login').respond(
                resp
            );
            service.login(userCredentials, function (result) {
                expect(result).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    })
    
})