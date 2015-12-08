describe("Unit tests for PasswordResetController", function (service) {

	var controller, scope, rootScope, $httpBackend, service, cookie;

	beforeEach(function(){module('AngularApp');});

	beforeEach(inject(function ($injector, $rootScope, $controller, $cookieStore) {
		service = $injector.get('DbService');
		$httpBackend = $injector.get('$httpBackend');
		scope = $rootScope.$new();
		rootScope = $rootScope;
		cookie = $cookieStore;
		controller = $controller('PasswordResetController', {
			'$scope': scope,
			'DbService': service
		});
	}));

	describe('Unit tests to handle security questions for user password update', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		it("tests if user reset passsword on submitting correct answer is handled", function () {
			scope.securityAnswer = "answer";
			scope.submitSecAnswer("answer");
			expect(scope.canResetPassword).toEqual(true);
		});

		it("tests if user reset passsword on submitting incorrect answer is handled", function () {
			scope.securityAnswer = "answer1";
			scope.submitSecAnswer("answer");
			expect(scope.canResetPassword).toEqual(false);
		});

	});

	describe('Unit tests for user password update', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		it("tests if user password update successful response is handled", function () {
			$httpBackend.whenPOST('/user/updatePassword').respond(200, resp);
			scope.resetPassword("password");
			$httpBackend.flush();
			expect(scope.message).toEqual("Password reset was successful");
		});

		it("tests if user information update unsuccessful response is handled", function () {
			$httpBackend.whenPOST('/user/updatePassword').respond(1, resp);
			scope.resetPassword("password");
			$httpBackend.flush();
			expect(scope.message).toEqual("Password reset was not successful");
		});
	});
	
	describe('Unit tests to get user details in password update', function () {
		var resp = window.getJSONFixture('../../../../responses/userResponse.json');
		it("tests if user details are retrieved on successful username", function () {
			$httpBackend.whenPOST('/user/details').respond(200, resp);
			scope.getUserDetails("username");
			$httpBackend.flush();
			expect(scope.showSecQues).toEqual(true);
			expect(scope.canResetPassword).toEqual(false);
			expect(scope.username).toEqual(resp.username);

		});

		it("tests if error is handled retrieved on invalid username", function () {
			$httpBackend.whenPOST('/user/details').respond(1, resp);
			scope.getUserDetails("username");
			$httpBackend.flush();
			expect(scope.showSecQues).toEqual(false);
		});
	});

});