app.factory("MapService", function ($http, $rootScope) {
	
	var getUserLocation = function (successResponseHandler) {
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(successResponseHandler, function() {
		    	$rootScope.apiResponse = 1;
		    });
		  } else {
		    // Browser doesn't support Geolocation
			  $rootScope.apiResponse = 1;
		  }
	};

	var getLocationForAddress = function(address, responseHandler){
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
		$http.get(url + address).then(responseHandler,responseHandler);
	};
	
	return {
		getUserLocation : getUserLocation,
		getLocationForAddress: getLocationForAddress
	};
});