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

	var select = document.getElementById('securityQuestions');
	var count = 1;
	var selectCount = 0;
	for( question in $rootScope.securityQuestions ) {
		select.add( new Option($rootScope.securityQuestions[question], question));
		if (question == $scope.user.security_question){
			selectCount = count;
		}
		count++;
	};	
	select.selectedIndex = selectCount;

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
			console.log($scope.user.security_question);
			console.log($scope.user.security_answer);
			console.log($scope.user.liked_categories);
			//DbService.updateUserDetails($scope.user, updateProfileResponseHandler);
		}
	};
});