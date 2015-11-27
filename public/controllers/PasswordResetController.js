app.controller('PasswordResetController', function($scope, $rootScope, $location, DbService){
	$scope.gotUsername = false;
	$scope.getUserDetails = function(username) {
		if (getStringObjectIfAvailable(username)) {
			DbService.getUserDetails(username, function(response){
				response = getObjectIfAvailable(response);
				if(response.status == 200 && getObjectIfAvailable(response.data)){
					$scope.showSecQues = true;
					$scope.canResetPassword = false;
					$scope.username = response.data.username;
					$scope.securityQuestion = $rootScope.securityQuestions[response.data.security_question];
					$scope.securityAnswer = response.data.security_answer;
				}
				else {
					$scope.showSecQues = false;
				}	
			})
		}
	}

	$scope.submitSecAnswer = function(secAns) {
		if (getStringObjectIfAvailable(secAns) && (secAns==$scope.securityAnswer)) {
			$scope.canResetPassword = true;
		}
		else {
			$scope.ansIncorrect = true;
			$scope.canResetPassword = false;
		}
	}

	$scope.resetPassword = function(password) {
		if (getStringObjectIfAvailable(password)) {
			var userCredentials = new UserCredential();
			userCredentials.setCredentials($scope.username, password);
			DbService.updatePassword(userCredentials, function(response){
				if(response && response.status == 200){
					$scope.message = "Password reset was successful";
				}
				else {
					$scope.message = "Password reset was not successful";
				}	
			})
		}
		else {
			$scope.ansIncorrect = true;
			$scope.canResetPassword = false;
		}
	}

	$scope.cancel = function() {
		$location.path('/login');
	}


})
