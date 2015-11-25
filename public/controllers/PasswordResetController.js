app.controller('PasswordResetController', function($scope, $rootScope, $location, DbService){
	$scope.loginError = false;
	$scope.login = function(user) {
		$scope.loginError = false;
		var userCredentials = new UserCredential();
		if (getStringObjectIfAvailable(user) && getStringObjectIfAvailable(user.username) && getStringObjectIfAvailable(user.password)) {
			userCredentials.setCredentials(user.username, user.password);
			DbService.login(user, function(response){
				response = getObjectIfAvailable(response);
				if(response && response.status == 200){
					$rootScope.currentUser = userCredentials.username;
					DbService.getUserDetails($rootScope.currentUser,userDetailsResponseHandler);
				}
				else {
					$scope.loginError = true;
					$location.url('/login');
				}	
			})
		}
	}
})
