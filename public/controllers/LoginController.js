app.controller('LoginController', function($scope, $rootScope, $location, DbService){
	$scope.login = function(user) {
		var userCredentials = new UserCredential();
		userCredentials.setCredentials(user.username, user.password);
		DbService.login(user, function(response){
			if(typeof response != undefined || response != null){
				$rootScope.currentUser = userCredentials.username;
				$location.url('/home');
			}
			else {
				$location.url('/login');
			}	
		})
	}
})
