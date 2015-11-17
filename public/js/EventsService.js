app.factory("EventsService", function ($http) {

	var fetchEventsByLocation = function(param_map, responseHandler){
		var query = "";
		for(key in param_map){
			query += "&" + key + "=" + param_map[key];
		}
		var url = "https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json&expand=logo,venue";
		$http.get(url + query).success(responseHandler);
	};
	
	return {	
		fetchEventsByLocation : fetchEventsByLocation
	};
});