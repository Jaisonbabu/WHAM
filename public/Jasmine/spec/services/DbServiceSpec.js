describe("Unit tests for DbService", function (service) {
    beforeEach(function(){module('AngularApp');});

    var service, $httpBackend;
    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            service = $injector.get('DbService');
            $httpBackend = $injector.get('$httpBackend');
        });
    });
    
    describe('Unit tests for user related db methods', function () {
    	var resp = window.getJSONFixture('../../../../responses/userResponse.json');
        
    	it("login calls dbMethod successfully", inject(function () {
        	var userCredentials = {};        	

            $httpBackend.whenPOST('/login').respond(
                resp
            );
            service.login(userCredentials, function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    	
    	it("logout calls dbMethod successfully", inject(function () {
        	var userCredentials = {};        	

            $httpBackend.whenPOST('/logout').respond(
                resp
            );
            service.logout(function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    	
    	it("getUserDetails calls dbMethod successfully", inject(function () {
        	var username = {};        	

            $httpBackend.whenPOST('/user/details').respond(
                resp
            );
            service.getUserDetails(username, function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    	
    	it("updateUserDetails calls dbMethod successfully", inject(function () {
        	var userObj = {};        	

            $httpBackend.whenPUT('/user/updateDetails').respond(
                resp
            );
            service.updateUserDetails(userObj, function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    	
    	it("updatePassword calls dbMethod successfully", inject(function () {
        	var userCredentials = {};        	

            $httpBackend.whenPOST('/user/updatePassword').respond(
                resp
            );
            service.updatePassword(userCredentials, function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    	
    	it("addNewUserDetails calls dbMethod successfully", inject(function () {
        	var userObj = {};        	

            $httpBackend.whenPOST('/user/addNewDetails').respond(
                resp
            );
            service.addNewUserDetails(userObj, function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));
    	
    	it("addNewLoginCredentials calls dbMethod successfully", inject(function () {
        	var userCredentials = {};        	

            $httpBackend.whenPOST('/user/addNewLogin').respond(
                resp
            );
            service.addNewLoginCredentials(userCredentials, function (result) {
                expect(result.data).toEqual(resp);
            });
            $httpBackend.flush();
        }));    	
    });    
})