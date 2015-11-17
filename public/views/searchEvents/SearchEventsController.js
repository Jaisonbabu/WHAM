app.controller('SearchEventsController', function($anchorScroll, $scope,$http, $timeout, EventsService, MapService){	

	var params = {};
	var d = new Date();
	var utcTime = d.getUTCFullYear()+'-'+d.getUTCMonth()+'-'+d.getUTCDate()+'T'+d.getUTCHours()+':'+d.getUTCMinutes()+':'+d.getUTCSeconds()+'Z';
	/*var time = {
			"timezone": "America/New_York",
			"utc": utcTime
	};*/

	/*var timeZone = {start_date:{
		range_start :{}
	}};
	timeZone.start_date.range_start=time;*/

	//params.start_date.range_start = time;

	var getLocationResponseHandler = function(response){
		//TODO: handle response status
		//if (response!=null && response)
		//TODO: handle empty results
		if (response.results.length > 0){
			params["location.latitude"] = lat = response.results[0].geometry.location.lat;
			params["location.longitude"] = long = response.results[0].geometry.location.lng;
			params["location.within"] = 5+'mi';
			EventsService.fetchEventsByLocation(params, searchEventsResponseHandler(lat, long));
		}
		else{
			console.log("no results for location");
		}
	};

	var getUserLocationResponseHandler = function(position) {
		params["location.latitude"] = lat = position.coords.latitude;
		params["location.longitude"] = long = position.coords.longitude;
		params["location.within"] = 5+'mi';
		EventsService.fetchEventsByLocation(params, searchEventsResponseHandler(lat, long));
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
			console.log(response.events);

			var events = [];		

			for(var i in $scope.events){
				var event = new Event();
				if($scope.events[i].logo){
					event.imageUrl = $scope.events[i].logo.url;
				}

				//TODO: handle nulls
				/*if($scope.events[i].venue) {
					event.lat = $scope.events[i].venue.latitude;
					event.long = $scope.events[i].venue.longitude;
					event.address = $scope.events[i].venue.address.address_1+',';
					event.city = $scope.events[i].venue.address.city+',';
					event.state = $scope.events[i].venue.address.region;
					event.startTimestamp = $scope.events[i].start.local;				
				}*/
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
				if($scope.events[i].venue.address.city) {
					event.venue.location.city = $scope.events[i].venue.address.city;
				}
				if($scope.events[i].venue.address.region) {
					event.venue.location.state = $scope.events[i].venue.address.region;
				}
				if($scope.events[i].start.local) {
					event.venue.location.startTime = $scope.events[i].start.local;
				}

				events.push(event);
			}

			var mapOptions = {
					zoom: 12,
					center: new google.maps.LatLng(lt, lg),
					mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			$scope.markers = [];

			var infoWindow = new google.maps.InfoWindow();

			var createMarker = function (info){

				var marker = new google.maps.Marker({
					map: $scope.map,
					position: new google.maps.LatLng(info.lat, info.long),
					zoom : 12,
					name : info.name,
					venue_name : info.venue_name,
					address : info.address,
					city : info.city,
					fullPostalCode : info.fullPostalCode,
					state : info.state,
					startTimestamp : info.startTimestamp,
					imageUrl : info.imageUrl
				});

				var date = new Date(info.startTimestamp);
				marker.content = '<div class="infoWindowContent">'+ info.venue_name+"<br/>"+ info.address + "\n,"+ info.city+"\n,"+ info.state + '<br/>'+date.format('M jS, Y - g:i A')+'</div>';

				google.maps.event.addListener(marker, 'mouseover', function(){
					infoWindow.setContent('<h3>' + marker.name + '</h3>'+ marker.content);
					infoWindow.open($scope.map, marker);
				});

				$scope.markers.push(marker);
			};  

			for (i = 0; i < events.length; i++){
				createMarker(events[i]);
			}
			$scope.openInfoWindow = function(e, selectedMarker) {
				e.preventDefault();
				google.maps.event.trigger(selectedMarker, 'mouseover');
			};
		};
	};

	$scope.searchEventsCurrentLoc = function(){
		MapService.getUserLocation(getUserLocationResponseHandler);		
	};

	$scope.searchEventsCurrentLoc();

});