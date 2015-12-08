describe("Unit tests for RegistrationController", function (service) {

	var controller, scope, rootScope, $httpBackend, service;

	beforeEach(function(){module('AngularApp');});

	beforeEach(inject(function ($injector, $rootScope, $controller) {
		service = $injector.get('DbService');
		$httpBackend = $injector.get('$httpBackend');
		scope = $rootScope.$new();
		rootScope = $rootScope;
		scope.selectedQues = {'name':'ques1', 'value':'What is your pet\'s name?'};
		controller = $controller('RegistrationController', {
			'$scope': scope,
			'DbService': service
		});
	}));

	describe('Unit tests for registration handling insertions into registration and login tables', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');

		it("tests if successful insertion into registration and login tables is handles", function () {
			$httpBackend.whenPOST('/user/addNewDetails').respond(200, resp);
			$httpBackend.whenPOST('/user/addNewLogin').respond(200, resp);
			scope.register(user);
			$httpBackend.flush();
			expect(scope.registrationStatus).toEqual('Registration was successful!!');
		});

		it("tests if error from login table is handled", function () {
			$httpBackend.whenPOST('/user/addNewDetails').respond(200,resp);
			$httpBackend.whenPOST('/user/addNewLogin').respond(1,resp);
			scope.register(user);
			$httpBackend.flush();
			expect(scope.registrationStatus).toEqual("Registration failed. Please try again.");			
		});

		it("tests if error from registration table is handled", function () {
			$httpBackend.whenPOST('/user/addNewDetails').respond(1,resp);
			scope.register(user);
			$httpBackend.flush();
			expect(scope.registrationStatus).toEqual("Registration failed. Please try again.");			
		});
	});
});