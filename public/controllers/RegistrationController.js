app.controller('RegistrationController',function($scope, $rootScope, $location, DbService){

	$("#txtLocation").val("");
	$("#txtQuery").val("");
	$("#categories").val("All Categories");
	$scope.security_questions = $rootScope.securityQuestions;
	$scope.categories = $rootScope.categories;
	$scope.selection=[];
	// toggle selection for a given category
	$scope.toggleSelection = function toggleSelection(category) {
		var idx = $scope.selection.indexOf(category);
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		} else {
			$scope.selection.push(category);
		}
	};

	$scope.register = function(user) {
		var userDetails = new User();
		var userCredentials = new UserCredential();
		if (getStringObjectIfAvailable(user) && getStringObjectIfAvailable(user.username)) {
			user.liked_categories = [];
			for(i in $scope.selection){
				for (j in $scope.selection[i].value){
					user.liked_categories.push($scope.selection[i].value[j]);
				}
			}
			user.security_question = $scope.selectedQues.name;
			userDetails.setUser(user);
			userCredentials.setCredentials(user.username, user.password);
			DbService.addNewUserDetails(userDetails, function(response){
				response = getObjectIfAvailable(response);
				if(response && response.status==200){
					DbService.addNewLoginCredentials(userCredentials, function(response){
						if(response && response.status==200) {
							$scope.registrationStatus = "Registration was successful!!";
						} else {
							$scope.registrationStatus = "Registration failed. Please try again.";
						}
					});
				}
				else {
					$scope.registrationStatus = "Registration failed. Please try again.";
				}
				//$location.url('/register');
			});
		}
	};
});