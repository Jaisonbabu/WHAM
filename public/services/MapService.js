app.factory("MapService", function ($http) {
	
	var getUserLocation = function (successResponseHandler) {
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(successResponseHandler, function() {
		      handleLocationError(true);
		    });
		  } else {
		    // Browser doesn't support Geolocation
		    handleLocationError(false);
		  }
		  return null;
	};

	function handleLocationError(browserHasGeolocation) {
			var mapOptions = {
					zoom: 1,
					center: new google.maps.LatLng(-1, 1),
					mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById('map'), mapOptions);
			var infoWindow = new google.maps.InfoWindow({map: map});
			infoWindow.setPosition(pos);
			infoWindow.setContent(browserHasGeolocation ?
		                        'Error: The Geolocation service failed.' :
		                        'Error: Your browser doesn\'t support geolocation.');
		}

	var getLocationForAddress = function(address, responseHandler){
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
		$http.get(url + address).success(responseHandler);
	};
	
	return {
		getUserLocation : getUserLocation,
		getLocationForAddress: getLocationForAddress
	};
});