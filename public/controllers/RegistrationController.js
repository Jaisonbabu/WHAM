app.controller('RegistrationController',function($scope, $rootScope, $location, DbService){
	var select = document.getElementById('securityQuestions');
	for( question in $rootScope.securityQuestions ) {
		select.add( new Option($rootScope.securityQuestions[question], question));
	};	

	$scope.categories = $rootScope.categories;
	$scope.selection=[];
	// toggle selection for a given category
	$scope.toggleSelection = function toggleSelection(category) {
		var idx = $scope.selection.indexOf(category);
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		}
		else {
			$scope.selection.push(category);
		}
	};

	$scope.register = function(user) {
		$scope.registrationError = false;
		var userDetails = new User();
		if (getStringObjectIfAvailable(user) && getStringObjectIfAvailable(user.username)) {
			user.liked_categories = [];
			for(i in $scope.selection){
				for (j in $scope.selection[i].value){
					user.liked_categories.push($scope.selection[i].value[j]);
				}
			}
			userDetails.setUser(user);
			console.log(user);
			console.log(JSON.stringify(user));
			DbService.register(userDetails, function(response){
				response = getObjectIfAvailable(response);
				if(response && response.status==200){
					$scope.registrationError = false;
				}
				else {
					$scope.registrationError = true;
				}	
				$location.url('/register');
			})
		}
	}

});