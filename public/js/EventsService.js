app.factory("EventsService", function ProductService($http) {

	var fetchEventsByLocation = function(location, callback){
		$http.get("https://www.eventbriteapi.com/v3/events/search/?token=SVLBJRZ4G7ATSPI77JQ3&format=json")
		.success(callback);
	}

	return {
		fetchEventsByLocation : fetchEventsByLocation
	}
})