
var app = angular.module('AngularApp', ['ngRoute','ui.bootstrap.transition', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

app.controller('MainController', function ($scope,$route, EventsService, $rootScope, $location, DbService) {
	
	$rootScope.categories = {'Food' : '110', 'Film and Arts': '104,105', 'Music' : '103','Holidays': '116','Sports': '107,108,109', 'Science and business':'101,102,115'};
	$scope.logout = function()
	{
		DbService.logout(function(response)
				{
			$rootScope.currentUser = null;	
			$location.path('/home');
				});
	}
});

app.filter('offset', function () {
	return function (input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
});

app.directive('scrollOnClick', function() {
	return {
		restrict: 'A',
		link: function(scope, $elm, attrs) {
			var idToScroll = attrs.href;
			$elm.on('click', function() {
				var $target;
				if (idToScroll) {
					$target = $(idToScroll);
				} else {
					$target = $elm;
				}
				$("body").animate({scrollTop: $target.offset().top}, "slow");
			});
		}
	}
});

app.directive('uniqueUsername', ['$http', function($http, $timeout) {  
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			scope.busy = false;
			scope.$watch(attrs.ngModel, function(value) {

				// hide old error messages
				ctrl.$setValidity('isTaken', true);

				if (!value) {
					// empty username is caught by required directive
					return;
				}

				// show spinner
				scope.busy = true;

				// send request to server
				$http.post('/user/checkUsername',{username:value})
				.success(function(data) {
					// everything is fine -> do nothing
					scope.busy = false;

				})
				.error(function(data) {

					// display new error message
					if (data.isTaken) {
						ctrl.$setValidity('isTaken', false);
					}
					scope.busy = false;
				});
			})
		}
	}
}]);

app.directive('checkPassword', ['$http', function($http, $timeout) {  
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			scope.busy = false;
			scope.$watch(attrs.ngModel, function(value) {

				// hide old error messages
				ctrl.$setValidity('noMatch', true);

				if (!value) {
					// empty username is caught by required directive
					return;
				}

				// show spinner
				scope.busy = true;

				// send request to server
				$http.post('/user/checkPassword',{username:scope.user.username, password:value})
				.success(function(data) {
					// everything is fine -> do nothing
					scope.busy = false;

				})
				.error(function(data) {

					// display new error message
					if (data.noMatch) {
						ctrl.$setValidity('noMatch', false);
					}
					scope.busy = false;
				});
			})
		}
	}
}]);


app.directive('match', [function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
				ctrl.$setValidity('match', value[0] === value[1] );
			}, true);
		}
	}
}]);

app.config(function ($routeProvider, $httpProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: '../views/SearchEvents.html',
		controller: 'SearchEventsController'
	})
	.when('/register', {
		templateUrl: '../views/registration.html',
		controller: 'RegistrationController'
	})

	.when('/login', {
		templateUrl: '../views/Login.htm',
		controller: 'LoginController'
	})

	.otherwise({
		redirectTo: '/home'
	})

	$httpProvider
	.interceptors
	.push(function($q, $location)
			{
		return {
			response: function(response)
			{
				return response;
			},
			responseError: function(response)
			{
				if (response.status === 401)
					$location.url('/home');
				return $q.reject(response);
			}
		};
			});

});

var getStringObjectIfAvailable = function (obj){
	if (obj != null && obj != undefined)
		return obj;
	return "";
};

var getObjectIfAvailable = function (obj){
	if (obj != null && obj != undefined)
		return obj;
	return null;
};