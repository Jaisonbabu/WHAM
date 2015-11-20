app.factory("DbService", function ($http) {

	var login = function(userCredentials, responseHandler){
		$http.post('/login', userCredentials)
		.success(responseHandler);
	};

	return {	
		login : login
	};
})
