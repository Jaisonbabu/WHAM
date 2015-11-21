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

	return {	
		login : login,
		logout : logout
	};
})
