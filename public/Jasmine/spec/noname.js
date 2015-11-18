describe("sample desc", function(service) {
	it("sample it", inject(function() {
		myAppDev = angular.module('myAppDev', [ 'AngularApp', 'ngMockE2E' ]);

		myAppDev.run(function($httpBackend) {
			phones = [ {
				name : 'phone1'
			}, {
				name : 'phone2'
			} ];

			// returns the current list of phones
			$httpBackend.whenGET('/phones').respond(phones);

			// adds a new phone to the phones array
			$httpBackend.whenPOST('/phones').respond(
					function(method, url, data) {
						var phone = angular.fromJson(data);
						phones.push(phone);
						return [ 200, phone, {} ];
					});
			$httpBackend.whenGET(/^\/templates\//).passThrough();
			// ...
		});
	}));
});