
var app = angular.module('AngularApp', ['ngRoute','ui.bootstrap.transition', 'ui.bootstrap', 'ui.bootstrap.datepicker', 'ngMessages']);

app.controller('MainController', function ($scope,$route, EventsService, $rootScope, $location, DbService, MapService, $routeParams) {

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

	var params = {};
	$scope.eventResponse = 0;
	$scope.apiResponse = 0;
	$scope.locationResponse = 0;
	$scope.search = 'search';

	var getLocationResponseHandler = function(response){
		response = getObjectIfAvailable(response);
		if(response && response.status == 200){
			results = getObjectIfAvailable(response.data.results);
			if (results && results.length > 0 && 
					getObjectIfAvailable(results[0].geometry.location)){
				var location = new Location();
				location.setLatLong(
						results[0].geometry.location.lat,
						results[0].geometry.location.lng);
				params = location.getParamsForSearch(params);
				EventsService.fetchEvents(params,searchEventsResponseHandler(location.latitude, location.longitude));
			}
			else{
				$scope.eventResponse = 0;
				$scope.locationResponse = 1;
			}
		}
		else{
			$scope.apiResponse = 1;
		}
	};

	var getUserLocationResponseHandler = function(position) {
		var location = new Location();
		location.setLatLong(
				position.coords.latitude,
				position.coords.longitude);
		params = location.getParamsForSearch(params);
		$rootScope.userLoc = new google.maps.LatLng(location.latitude, location.longitude);
		EventsService.fetchEvents(params, searchEventsResponseHandler(location.latitude, location.longitude));
	};

	select = document.getElementById( 'categories' );
	for( category in $scope.categories ) {
		select.add( new Option( ($scope.categories[category]).name, ($scope.categories[category]).value ));
	};	

	var searchEventsResponseHandler = function(lt, lg) {
		return function(response){
			response = getObjectIfAvailable(response); 

			if(response && response.status == 200) {
				$scope.locationResponse = 0;
				$scope.events = [];
				var data = getObjectIfAvailable(response.data);
				if (!data){
					$scope.eventResponse = 1;					
					return;
				}

				var events = getObjectIfAvailable(data.events); 
				if(events.length == 0){
					$scope.eventResponse = 1;
					return;
				}
				else{
					$scope.eventResponse = 0;
					events = getEvents(events,$rootScope.currentUser,$rootScope.userDetails);
					for(var i in events){
						$scope.events.push(events[i]);
					}
				}
				
				var mapOptions = {
						zoom: 12,
						center: new google.maps.LatLng(lt, lg),
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
				var image = new google.maps.MarkerImage(
						'http://plebeosaur.us/etc/map/bluedot_retina.png',
						null, // size
						null, // origin
						new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
						new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
				);

				userMarker = new MarkerWithLabel({
					flat: true,
					icon: image,
					map: $scope.map,
					optimized: true,
					position: $rootScope.userLoc,
					title: 'You are here',
					visible: true,
					//labelClass: "userLoc",
				});

				userMarker.setAnimation(google.maps.Animation.BOUNCE);

				var locationInput = document.getElementById('txtLocation');
				autocomplete = new google.maps.places.Autocomplete(locationInput);
				autocomplete.bindTo('bounds', $scope.map);

				autocomplete.addListener('place_changed', function() {
					var place = autocomplete.getPlace();
				});

				$scope.markers = [];
				//$scope.events = [];
				for (var i = 0; i < events.length; i++) {
					var marker = new Marker(events[i], $scope.map).marker;
					$scope.markers.push(marker);
					//$scope.events.push(marker);
				}
				console.log('length ='+ $scope.events.length);
				$scope.openInfoWindow = function(event, selectedMarker) {
					event.preventDefault();
					google.maps.event.trigger(selectedMarker, 'mouseover');
				};
				$scope.showContent = true;
			}
			else{
				$scope.apiResponse = 1;
			};
		};
	};

	$scope.searchEventsCurrentLoc = function(){		
		MapService.getUserLocation(getUserLocationResponseHandler);		
	};

	$scope.markers = [];
	$scope.showContent = false;
	var query = $("#txtQuery");
	var location = $("#txtLocation");
	var category  = $("#categories");

	// To delete old q from the params
	if(query.val()=="")
		delete params["q"];

	if (query!=null && query.val()!=""){
		params["q"] = query.val();
	}

	if (category!=null && category.val()!="" && category.val()!="All Categories"){
		params["categories"] = category.val();
	}
	// To delete old categories from the params
	if(category.val()=="")
		delete params["categories"];

	if (location!=null && location.val()!=""){
		MapService.getLocationForAddress(location.val(), getLocationResponseHandler);
	}
	else{
		$scope.searchEventsCurrentLoc();
	}	
//	});

	$("#txtQuery").keypress(function(e){
		if(e.which == 13){
			$("#btnSearch").click();
		}
	});

	$("#txtLocation").keypress(function(e){
		if(e.which == 13){
			$("#btnSearch").click();
		}
	});

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
	.when('/home/', {
		templateUrl: '../views/SearchEvents.html',
		controller: 'MainController'
	})

	.when('/home/:search', {
		templateUrl: '../views/SearchEvents.html',
		controller: 'MainController'
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

	.when('/profile/user', {
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
	user.dob = body.dob;
	user.gender = body.gender;
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
