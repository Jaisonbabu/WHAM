app.controller('PasswordResetController', function($scope, $rootScope, $location, DbService){
	$scope.getUserDetails = function(username) {
		if (getStringObjectIfAvailable(username)) {
			DbService.getUserDetails(username, function(response){
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
