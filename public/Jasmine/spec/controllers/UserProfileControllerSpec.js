describe("Unit tests for UserProfileController", function (service) {

	var controller, scope, rootScope, $httpBackend, service, cookie;
	
	beforeEach(function(){module('AngularApp');});
	
	beforeEach(inject(function ($injector, $rootScope, $controller, $cookieStore) {
		service = $injector.get('DbService');
        $httpBackend = $injector.get('$httpBackend');
		scope = $rootScope.$new();
        rootScope = $rootScope;
        cookie = $cookieStore;
        controller = $controller('UserProfileController', {
            '$scope': scope,
            'DbService': service
        });
        scope.categories = [];
        scope.selection = {'name':'Film and Arts', 'value': [104,105]};
        scope.selectedQues = {'name':'ques1', 'value':'ques1'};
        scope.username = "username";
    }));

	describe('Unit tests for Userprofile information update handling successful response', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		
		it("tests if user information update successful response is handled", function () {
			$httpBackend.whenPUT('/user/updateDetails').respond(resp);
			scope.updateProfile();
			$httpBackend.flush();
			expect(cookie.get("userDetails")).toEqual(resp);
		});
		
		it("tests if user password update successful response is handled", function () {
			$httpBackend.whenPOST('/user/updatePassword').respond(resp);
			scope.updatePassword("password");
			$httpBackend.flush();
		});
		
		it("tests if user information update erroneous response is handled", function () {
			$httpBackend.whenPUT('/user/updateDetails').respond(1,null);
			scope.updateProfile();
			$httpBackend.flush();
			expect(cookie.get("userDetails")).toEqual(null);
		});
		
	});
	
});