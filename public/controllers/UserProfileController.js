//TODO: check user is logged in
//TODO: add option to modify sec ques and answer
//TODO: error handling in response handlers
app.controller('UserProfileController', function($scope, $routeParams,
		$rootScope, DbService, $location, $cookieStore) {

	$scope.showEdit = true;
	$scope.updProfile = false; 
	$scope.profile = true; 
	$scope.updPswd = false;
	$("#txtLocation").val("");
	$("#txtQuery").val("");
	$("#categories").val("All Categories");
	// user who is currently logged in
	$scope.username = $cookieStore.get('username');
	$scope.user = $cookieStore.get('userDetails');
	$scope.newPassword = "";
	$scope.oldPassword = "";
	
	var getCatObjsFromCatIds = function(cats){
		var catObjs = [];
		for (j in cats){
			for (i in $scope.categories){
				if ($scope.categories[i].value.indexOf(cats[j]) > -1){
					catObjs.push($scope.categories[i]);
					break;
				}
			}
		}
		return catObjs;
	};
	
	$scope.security_questions = $rootScope.securityQuestions;
	for (i in $scope.security_questions){
		if ($scope.security_questions[i].name == $scope.user.security_question)
			$scope.selectedQues = $scope.security_questions[i];
	}
	$scope.categories = $rootScope.categories;
	$scope.selection = getCatObjsFromCatIds($scope.user.liked_categories);	
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
		$cookieStore.put('userDetails', resp.data);
		console.log(resp.data);
	};

	var updatePasswordResponseHandler = function(resp){
		//TODO: handle both positive and negative cases and show msgs
		console.log(resp.data);
	};

	$scope.updatePassword = function(pswd) {
		var userCredentials = new UserCredential();
		userCredentials.setCredentials($scope.username, pswd);
		DbService.updatePassword(userCredentials, updatePasswordResponseHandler);
	};

	$scope.updateProfile = function() {
		if (getObjectIfAvailable($scope.user)) {
			$scope.user.liked_categories = [];
			for(i in $scope.selection){
				for (j in $scope.selection[i].value){
					$scope.user.liked_categories.push($scope.selection[i].value[j]);
				}
			}
			$scope.user.security_question = $scope.selectedQues.name;
			DbService.updateUserDetails($scope.user, updateProfileResponseHandler);
		}
	};
});