
var app = angular.module('AngularApp', ['ngRoute','ui.bootstrap.transition', 'ui.bootstrap', 'ui.bootstrap.datepicker','ngMessages','ngCookies']);
app.controller('MainController', function ($scope,$route, EventsService, $rootScope, $window, DbService, MapService, $routeParams, $cookieStore) {

	$rootScope.categories = [{'name':'All Categories', 'value' : 'All Categories'},
	                         {'name':'Food', 'value' : [110]}, 
	                         {'name':'Film and Arts', 'value': [104,105]},
	                         {'name':'Music' , 'value':[103]},
	                         {'name':'Holidays', 'value':[116]},
	                         {'name':'Sports', 'value': [107,108,109]},
	                         {'name':'Science and Business', 'value':[101,102,115]}];

	$rootScope.securityQuestions = [{'name':'ques1', 'value':'What is your pet\'s name?'}, 
	                                {'name':'ques2','value':'Which city is/was your college in?'},
	                                {'name':'ques3', 'value':'Which city do your parents live?'},
	                                {'name':'ques4','value':'Which city were you born?'},
	                                {'name':'ques5','value':'What is your favorite movie?'}];

	$scope.logout = function() {
		$("#txtLocation").val("");
		$("#txtQuery").val("");
		$("#categories").val("All Categories");
		DbService.logout(function(response) {
			$cookieStore.remove('username');
			$rootScope.currentUser = null;
			$cookieStore.remove('userDetails');
			$rootScope.userDetails = null;
			$window.location.href = '/#/home';
		});
	};

	var params = {};	
	$scope.eventResponse = 0;
	$rootScope.apiResponse = 0;
	$scope.locationResponse = 0;
	$scope.categories = $rootScope.categories;
	if ($scope.selectedCategory == undefined)
		$scope.selectedCategory = $scope.categories[0];
	if ($cookieStore.get('username')){
		$rootScope.userDetails = $cookieStore.get('userDetails');
		$rootScope.currentUser = $cookieStore.get('username');
	}
	$scope.queryKeyword = "";
	$scope.queryCategory = "";
	
	if($routeParams.shouldReset){
		var shouldReset = $routeParams.shouldReset;
		$("#txtLocation").val("");
		$("#txtQuery").val("");
		$("#categories").val("All Categories");
	}

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
			$rootScope.apiResponse = 1;
		}
	};

	var getUserLocationResponseHandler = function(position) {
		var location = new Location();
		location.setLatLong(
				position.coords.latitude,
				position.coords.longitude);
		params = location.getParamsForSearch(params);
		$scope.userLoc = new google.maps.LatLng(location.latitude, location.longitude);
		$cookieStore.put('userLoc', $scope.userLoc);
		EventsService.fetchEvents(params, searchEventsResponseHandler(location.latitude, location.longitude));
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
				if(events == null || events.length == 0){
					$scope.eventResponse = 1;
					return;
				}
				else{
					$scope.eventResponse = 0;
					$rootScope.apiResponse = 0;
					events = getEvents(events,$rootScope.currentUser,$rootScope.userDetails, $scope.queryKeyword, $scope.queryCategory);
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
					position: $scope.userLoc,
					title: 'You are here',
					visible: true,
					//labelClass: "userLoc",
				});

				userMarker.setAnimation(google.maps.Animation.BOUNCE);

				var locationInput = document.getElementById('txtLocation');
				autocomplete = new google.maps.places.Autocomplete(locationInput);
				//autocomplete.bindTo('bounds', $scope.map);

				autocomplete.addListener('place_changed', function() {
					var place = autocomplete.getPlace();
				});

				$scope.markers = [];
				for (var i = 0; i < events.length; i++) {
					var marker = new Marker(events[i], $scope.map).marker;
					$scope.markers.push(marker);
				}
				$scope.openInfoWindow = function(event, selectedMarker) {
					event.preventDefault();
					google.maps.event.trigger(selectedMarker, 'mouseover');
				};
				$scope.showContent = true;
			}
			else{
				$rootScope.apiResponse = 1;
			};
		};
	};

	$scope.searchEventsCurrentLoc = function(){		
		MapService.getUserLocation(getUserLocationResponseHandler);
	};

	$scope.showContent = false;
	var query = $("#txtQuery");
	var location = $("#txtLocation");

	// To delete old q from the params
	if(query.val()=="")
		delete params["q"];

	if (query!=null && query.val()!=""){
		$scope.queryKeyword = query.val();
		params["q"] = query.val();
	}

	if ($scope.selectedCategory!=null && $scope.selectedCategory.value!="" && $scope.selectedCategory.value!="All Categories"){
		$scope.queryCategory = $scope.selectedCategory.value;
		params["categories"] = $scope.selectedCategory.value;
	}
	// To delete old categories from the params
	if($scope.selectedCategory && $scope.selectedCategory.value=="")
		delete params["categories"];

	if (location!=null && location.val()!=""){
		MapService.getLocationForAddress(location.val(), getLocationResponseHandler);
	}
	else{
		$scope.searchEventsCurrentLoc();
	}	

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
	
	$("#btnSearch").on('click', function(){
		$scope.markers = [];
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

	.when('/home/:shouldReset', {
		templateUrl: '../views/SearchEvents.html',
		controller: 'MainController'
	})

	.otherwise({
		redirectTo: '/home/'
	});

	$httpProvider
	.interceptors
	.push(function($q, $window)
			{
		return {
			response: function(response)
			{
				return response;
			},
			responseError: function(response)
			{
				if (response.status === 401)
					$window.location.href = '/#/home';
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
	body = getObjectIfAvailable(body);
	if(!body)
		return user;
	user.username = getStringObjectIfAvailable(body.username);
	user.firstname = getStringObjectIfAvailable(body.firstname);
	user.lastname = getStringObjectIfAvailable(body.lastname);
	user.email = getStringObjectIfAvailable(body.email);
	user.dob = getStringObjectIfAvailable(body.dob);
	user.gender = getStringObjectIfAvailable(body.gender);
	user.liked_categories = getObjectIfAvailable(body.liked_categories);
	user.disliked_venues = getObjectIfAvailable(body.disliked_venues); 
	user.security_question = getStringObjectIfAvailable(body.security_question);
	user.security_answer = getStringObjectIfAvailable(body.security_answer);
	user.location.addressLine1 = getStringObjectIfAvailable(body.address_1);
	user.location.addressLine2 = getStringObjectIfAvailable(body.address_2);
	user.location.city = getStringObjectIfAvailable(body.city);
	user.location.state = getStringObjectIfAvailable(body.state);
	user.location.postal = getStringObjectIfAvailable(body.postal);
	user.location.country = getStringObjectIfAvailable(body.country);	
	return user;
};
