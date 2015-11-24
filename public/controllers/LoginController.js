app.controller('LoginController', function($scope, $rootScope, $location, DbService){
	$scope.login = function(user) {
		
		$scope.loginError = false;
		var userCredentials = new UserCredential();
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
})
