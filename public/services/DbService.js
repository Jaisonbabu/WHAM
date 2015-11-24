app.factory("DbService", function ($http) {

	var login = function(userCredentials, responseHandler){
		$http.post('/login', userCredentials)
		.success(responseHandler);
	};
	
	var logout = function(responseHandler)
	{
		$http.post('/logout')
		.success(responseHandler);
	};

	var getUserDetails = function(username, responseHandler){
		$http.post('/user/details', {'username' : username})
		.success(responseHandler);
	};
	
	var updateUserDetails = function(userObj, responseHandler){
		$http.put('/user/updateDetails', JSON.stringify(userObj))
		.success(responseHandler);
	};
	
	var updatePassword = function(userCredentials, responseHandler){
		$http.post('/user/updatePassword', JSON.stringify(userCredentials))
		.success(responseHandler);
	};
	
	return {	
		login : login,
		logout : logout,
		getUserDetails : getUserDetails,
		updateUserDetails : updateUserDetails,
		updatePassword : updatePassword
	};
});
