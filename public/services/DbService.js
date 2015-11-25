app.factory("DbService", function ($http) {

	var login = function(userCredentials, responseHandler){
		$http.post('/login', userCredentials)
		.then(responseHandler,responseHandler);
	};

	var logout = function(responseHandler)
	{
		$http.post('/logout')
		.success(responseHandler);
	};

	var register = function(userDetails, responseHandler){
		$http.post('/register', userDetails)
		.then(responseHandler,responseHandler);
	};

	var getUserDetails = function(username, responseHandler){
		$http.post('/user/details', {'username' : username})
		.then(responseHandler, responseHandler);
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
		register : register,
		getUserDetails : getUserDetails,
		updateUserDetails : updateUserDetails,
		updatePassword : updatePassword
	};
});
