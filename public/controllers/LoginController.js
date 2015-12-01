app.controller('LoginController', function($scope, $rootScope, $location, DbService, $cookieStore){
	$scope.loginError = false;
	
	var userDetailsResponseHandler = function(response){
		user = new User();
		$rootScope.userDetails = mapDbObjToUserObj(user,response.data);
		console.log(response);
		$cookieStore.put('username', $rootScope.currentUser);
		$cookieStore.put('userDetails', $rootScope.userDetails);
		$location.url('/home');
	};
	
	$scope.login = function(user) {
		$scope.loginError = false;
		var userCredentials = new UserCredential();
		if (getObjectIfAvailable(user) && getStringObjectIfAvailable(user.username) && getStringObjectIfAvailable(user.password)) {
			userCredentials.setCredentials(user.username, user.password);
			DbService.login(user, function(response){
				response = getObjectIfAvailable(response);
				if(response && response.status == 200){
					$rootScope.currentUser = userCredentials.username;
					DbService.getUserDetails($rootScope.currentUser, userDetailsResponseHandler);
				}
				else {
					$scope.loginError = true;
					$location.url('/login');
				}	
			});
		}
	};
	
	$("#username").keypress(function(e){
		if(e.which == 13){
			$("#btn-login").click();
		}
	});

	$("#password").keypress(function(e){
		if(e.which == 13){
			$("#btn-login").click();
		}
	});
});
