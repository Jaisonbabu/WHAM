describe("Unit tests for LoginController", function (service) {

	var controller, scope, rootScope, $httpBackend, service, cookie;
	
	beforeEach(function(){module('AngularApp');});
	
	beforeEach(inject(function ($injector, $rootScope, $controller, $cookieStore) {
		service = $injector.get('DbService');
        $httpBackend = $injector.get('$httpBackend');
		scope = $rootScope.$new();
        rootScope = $rootScope;
        cookie = $cookieStore;
        controller = $controller('LoginController', {
            '$scope': scope,
            'DbService': service
        });
    }));

	describe('Unit tests for login', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		beforeEach(function(){						
			$httpBackend.whenPOST('/login').respond(resp);
			$httpBackend.whenPOST('/user/details').respond(resp);
			scope.login({"username": "username", "password": "password"});
			$httpBackend.flush();
		});
		
		it("test if valid response is handled", function () {
			expect(rootScope.currentUser).toEqual('username');
			expect(rootScope.userDetails).toEqual(mapDbObjToUserObj(new User(),resp));
			expect(cookie.get("username")).toEqual('username');
			expect(cookie.get("userDetails").firstname).toEqual(resp.firstname);
		});
	});
	
	describe('Unit tests for login handling invalid credentials', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		beforeEach(function(){						
			$httpBackend.whenPOST('/login').respond(1,null);
			scope.login({"username": "1", "password": "password"});
			$httpBackend.flush();
		});
		
		it("test if valid response is handled", function () {
			expect(scope.loginError).toEqual(true);			
		});
	});
	
	describe('Unit tests for login handling invalid info', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		beforeEach(function(){						
			$httpBackend.whenPOST('/login').respond(null);
			$httpBackend.whenPOST('/user/details').respond(1, null);
			scope.login({"username": "1", "password": "password"});
			$httpBackend.flush();
		});
		
		it("test if valid response is handled", function () {
			expect(scope.loginError).toEqual(true);			
		});
	});
});