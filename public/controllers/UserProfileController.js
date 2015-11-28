//TODO: check user is logged in
//TODO: add option to modify sec ques and answer
//TODO: error handling in response handlers
app.controller('UserProfileController', function($scope, $routeParams,
		$rootScope, DbService, $location) {

	$scope.showEdit = true;
	$scope.updProfile = false; 
	$scope.profile = true; 
	$scope.updPswd = false;

	// user who is currently logged in
	$scope.username = $rootScope.currentUser;
	$scope.user = $rootScope.userDetails;
	$scope.newPassword = "";
	$scope.oldPassword = "";

	$scope.security_questions = $rootScope.securityQuestions;
	for (i in $scope.security_questions){
		if ($scope.security_questions[i].name == $scope.user.security_question)
			$scope.selectedQues = $scope.security_questions[i];
	}
	$scope.categories = $rootScope.categories;
	$scope.selection = $scope.user.liked_categories;	
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

	var updateProfileResponseHandler = function(resp) {
		//TODO: handle both positive and negative cases and show msgs
	};

	var updatePasswordResponseHandler = function(resp){
		//TODO: handle both positive and negative cases and show msgs
	};

	$scope.updatePassword = function(pswd) {
		console.log(pswd);
		var userCredentials = new UserCredential();
		userCredentials.setCredentials($scope.username, pswd);
		DbService.updatePassword(userCredentials, updatePasswordResponseHandler);
	};

	$scope.updateProfile = function() {
		if (getObjectIfAvailable($scope.user)) {
			$scope.user.liked_categories = $scope.selection;
			$scope.user.security_question = $scope.selectedQues.name;
			DbService.updateUserDetails($scope.user, updateProfileResponseHandler);
		}
	};
});