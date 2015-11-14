app.factory("EventsService", function ProductService($http) {

	var fetchEventsByLocation = function(param_map, responseHandler){
		var query = "";
		for(key in param_map){
			query += "&" + key + "=" + param_map[key];
		}
		
		$http.get("https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json" + query)
		.success(responseHandler);
	}

	return {
		fetchEventsByLocation : fetchEventsByLocation
	}
})