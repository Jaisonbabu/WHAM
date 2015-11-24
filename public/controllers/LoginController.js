app.controller('LoginController', function($scope, $rootScope, $location, DbService){
	$scope.login = function(user) {
		$scope.loginError = false;
		var userCredentials = new UserCredential();
		if (getStringObjectIfAvailable(user) && getStringObjectIfAvailable(user.username) && getStringObjectIfAvailable(user.password)) {
			userCredentials.setCredentials(user.username, user.password);
			DbService.login(user, function(response){
				response = getObjectIfAvailable(response);
				if(response){
					$rootScope.currentUser = userCredentials.username;
					$location.url('/home');
				}
				else {
					$location.url('/login');
				}	
			})
		}
	}
})
