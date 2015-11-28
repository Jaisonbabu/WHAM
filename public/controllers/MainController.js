
var app = angular.module('AngularApp', ['ngRoute','ui.bootstrap.transition', 'ui.bootstrap', 'ui.bootstrap.datepicker', 'ngMessages']);

app.controller('MainController', function ($scope,$route, EventsService, $rootScope, $location, DbService) {

	$rootScope.categories = [{'name':'Food', 'value' : [110]}, 
	                         {'name':'Film and Arts', 'value': [104,105]},
	                         {'name':'Music' , 'value':[103]},
	                         {'name': 'Holidays', 'value':[116]},
	                         {'name':'Sports', 'value': [107,108,109]},
	                         {'name':'Science and Business', 'value':[101,102,115]}];

	$rootScope.securityQuestions = [{'name':'ques1', 'value':'What is your pet\'s name?'}, 
	                                {'name':'ques2','value':'Which city is/was your college in?'},
	                                {'name':'ques3', 'value':'Which city do your parents live?'},
	                                {'name':'ques4','value':'Which city were you born?'},
	                                {'name':'ques5','value':'What is your favorite movie?'}];

	$scope.logout = function() {
		DbService.logout(function(response) {
			$rootScope.currentUser = null;	
			$location.path('/home');
		});
	};
});

app.directive('uniqueUsername', ['$http', 'DbService', function($http, DbService) {  
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			scope.busy = false;
			scope.$watch(attrs.ngModel, function(value) {
				ctrl.$setValidity('isTaken', true);
				if (!value) {
					return;
				}
				scope.busy = true;
				DbService.getUserDetails(value, function(response) {
					if (response.status == 200 && getObjectIfAvailable(response.data)
							&& response.data.username == value) {
						ctrl.$setValidity('isTaken', false);
					}
					scope.busy = false;
				})
			});
		}
	};
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
				scope.busy = true;
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
			});
		}
	};
}]);


app.directive('match', [function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
				ctrl.$setValidity('match', value[0] === value[1] );
			}, true);
		}
	};
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
		templateUrl: '../views/Login.html',
		controller: 'LoginController'
	})

	.when('/eventDetails/:eventId', {
		templateUrl: '../views/EventDetails.html',
		controller: 'EventDetailsController'
	})

	.when('/profile/user/:username', {
		templateUrl: '../views/UserProfile.html',
		controller: 'UserProfileController'
	})//TODO: check logged in

	.when('/passwordReset', {
		templateUrl: '../views/PasswordReset.html',
		controller: 'PasswordResetController'
	})

	.otherwise({
		redirectTo: '/home'
	});

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

var mapDbObjToUserObj = function(user, body){
	user.username = body.username;
	user.firstname = body.firstname;
	user.lastname = body.lastname;
	user.email = body.email;
	user.location.addressLine1 = body.address_1;
	user.location.addressLine2 = body.address_2;
	user.location.city = body.city;
	user.location.state = body.state;
	user.location.postal = body.postal;
	user.location.country = body.country;
	user.liked_categories = body.liked_categories;
	user.disliked_venues = body.disliked_venues; 
	user.security_question = body.security_question;
	user.security_answer = body.security_answer;
	return user;
};