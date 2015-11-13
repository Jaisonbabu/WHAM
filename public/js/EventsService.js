app.factory("EventsService", function ProductService($http) {

	var fetchEventsByLocation = function(param_map, callback){
		console.log(param_map);
		var query = "";
		var key ;
		for(key in param_map){
			query += "&" + key + "=" + param_map[key];
		}
		
//		var latitude = "location.latitude=" + location_latitude;
//		var longitude = "location.longitude=" + location_longitude;
		$http.get("https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json" + query)
		.success(callback);
	}

	return {
		fetchEventsByLocation : fetchEventsByLocation
	}
})