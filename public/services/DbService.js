app.factory("DbService", function ($http) {

	var login = function(userCredentials, responseHandler){
		$http.post('/login', userCredentials)
		.then(responseHandler,responseHandler);
	};
	
	var logout = function(responseHandler)
	{
		$http.post('/logout')
		.then(responseHandler,responseHandler);
	};

	var getUserDetails = function(username, responseHandler){
		$http.post('/user/details', {'username' : username})
		.then(responseHandler,responseHandler);
	};
	
	var updateUserDetails = function(userObj, responseHandler){
		$http.put('/user/updateDetails', JSON.stringify(userObj))
		.then(responseHandler,responseHandler);
	};
	
	var updatePassword = function(userCredentials, responseHandler){
		$http.post('/user/updatePassword', JSON.stringify(userCredentials))
		.then(responseHandler,responseHandler);
	};
	
	var addNewUserDetails = function(userObj, responseHandler){
		$http.post('/user/addNewDetails', JSON.stringify(userObj))
		.then(responseHandler,responseHandler);
	};
	
	var addNewLoginCredentials = function(credentials, responseHandler){
		$http.post('/user/addNewLogin', JSON.stringify(credentials))
		.then(responseHandler, responseHandler);
	};
	
	return {	
		login : login,
		logout : logout,
		getUserDetails : getUserDetails,
		updateUserDetails : updateUserDetails,
		updatePassword : updatePassword,
		addNewUserDetails : addNewUserDetails,
		addNewLoginCredentials : addNewLoginCredentials
	};
});
