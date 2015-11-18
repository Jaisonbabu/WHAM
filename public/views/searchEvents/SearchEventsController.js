app.controller('SearchEventsController', function($anchorScroll, $scope,$http, $timeout, EventsService, MapService){	

	var params = {};
	var d = new Date();
	var utcTime = d.getUTCFullYear()+'-'+d.getUTCMonth()+'-'+d.getUTCDate()+'T'+d.getUTCHours()+':'+d.getUTCMinutes()+':'+d.getUTCSeconds()+'Z';

	/*var time = {
			"timezone": "America/New_York",
			"utc": utcTime
	};*/

	var getLocationResponseHandler = function(response){
		//TODO: handle response statuses
		//if (response!=null && response)
		if (response.results.length > 0){
			var location = new Location();
			location.setLatLong(
					response.results[0].geometry.location.lat,
					response.results[0].geometry.location.lng);
			params = location.getParamsForSearch(params);
			EventsService.fetchEventsByLocation(params, 
					searchEventsResponseHandler(location.latitude, location.longitude));
		}
		else{
			//TODO: handle empty results
			console.log("no results for location");
		}
	};

	var getUserLocationResponseHandler = function(position) {
		var location = new Location();
		location.setLatLong(
				position.coords.latitude,
				position.coords.longitude);
		params = location.getParamsForSearch(params);
		EventsService.fetchEventsByLocation(params, searchEventsResponseHandler(location.latitude, location.longitude));
		};
		
		//TODO: Add enter key press listener
	$("#btnSearch").on("click", function(){
		var query = $("#txtQuery");
		var location = $("#txtLocation");		
		if (query!=null && query.val()!=""){
			params["q"] = query.val();
		}
		if (location!=null && location.val()!=""){
			MapService.getLocationForAddress(location.val(), getLocationResponseHandler);
		}
		else{
			$scope.searchEventsCurrentLoc();
		}		
	});

	var searchEventsResponseHandler = function(lt, lg) {
		return function(response){
			//TODO: handle response status
			$scope.events = response.events;
			var events = [];		

			for(var i in $scope.events){

				var event = new Event();
				if($scope.events[i].logo && $scope.events[i].logo.url){
					event.imageUrl = $scope.events[i].logo.url;
				}
				if($scope.events[i].name && $scope.events[i].name.text){
					event.name = $scope.events[i].name.text;
				}
				//TODO: get utc and convert time to local
				if($scope.events[i].start.local) {
					event.startTime = $scope.events[i].start.local;
				}
				if($scope.events[i].venue.latitude) {
					event.venue.location.latitude = $scope.events[i].venue.latitude;
				}
				if($scope.events[i].venue.longitude) {
					event.venue.location.longitude = $scope.events[i].venue.longitude;
				}
				if($scope.events[i].venue.name) {
					event.venue.name = $scope.events[i].venue.name;
				}
				if($scope.events[i].venue.address.address_1) {
					event.venue.location.addressLine1 = $scope.events[i].venue.address.address_1;
				}
				if($scope.events[i].venue.address.address_2) {
					event.venue.location.addressLine2 = $scope.events[i].venue.address.address_2;
				}
				if($scope.events[i].venue.address.city) {
					event.venue.location.city = $scope.events[i].venue.address.city;
				}
				if($scope.events[i].venue.address.region) {
					event.venue.location.state = $scope.events[i].venue.address.region;
				}				
				if($scope.events[i].venue.address.postal_code) {
					event.venue.location.postal = $scope.events[i].venue.address.postal_code;
				}
				events.push(event);
			}

			var mapOptions = {
					zoom: 12,
					center: new google.maps.LatLng(lt, lg),
					mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			//$scope.markers = [];
			
			for (i = 0; i < events.length; i++) {
				var marker = new Marker(events[i], $scope.map).marker;
				$scope.markers.push(marker);
			}
			
			$scope.openInfoWindow = function(e, selectedMarker) {
				e.preventDefault();
				google.maps.event.trigger(selectedMarker, 'mouseover');
			};
		};
	};

	$scope.searchEventsCurrentLoc = function(){
		$scope.markers = [];
		MapService.getUserLocation(getUserLocationResponseHandler);		
	};

	$scope.searchEventsCurrentLoc();

});