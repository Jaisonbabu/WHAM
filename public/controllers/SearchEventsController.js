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
			EventsService.fetchEvents(params, 
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
		EventsService.fetchEvents(params, searchEventsResponseHandler(location.latitude, location.longitude));
		};
		
	$("#btnSearch").on("click", function(){
		var query = $("#txtQuery");
		var location = $("#txtLocation");		
		if (query!=null && query.val()!=""){
			params["q"] = query.val();
		}
		if (location!=null && location.val()!=""){
			if (isNaN(location.val()))
			    MapService.getLocationForAddress(location.val(), getLocationResponseHandler);
			else
				alert("Please enter a valid location");
		}
		else{
			$scope.searchEventsCurrentLoc();
		}		
	});
	
	$("#txtQuery").keypress(function(e){
		if(e.which == 13){
			$("#btnSearch").click();
		}
	});
	
	$("#txtLocation").keypress(function(e){
		if(e.which == 13){
			$("#btnSearch").click();
		}
	});
	
	var searchEventsResponseHandler = function(lt, lg) {
		return function(response){
			//TODO: handle response status
			var events = getEvents(response.events);		
			$scope.events = events;
			
			var mapOptions = {
					zoom: 12,
					center: new google.maps.LatLng(lt, lg),
					mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
			
			$scope.userLoc = new google.maps.LatLng(lt, lg);
			
			var image = new google.maps.MarkerImage(
					'http://plebeosaur.us/etc/map/bluedot_retina.png',
					null, // size
					null, // origin
					new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
					new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
			);

			userMarker = new MarkerWithLabel({
				flat: true,
				icon: image,
				map: $scope.map,
				optimized: false,
				position: $scope.userLoc,
				title: 'You are here',
				visible: true,
				//labelClass: "userLoc", -- Uncomment for pulse CSS
			});
			
			$scope.map.setCenter( $scope.userLoc );
			
			userMarker.setAnimation(google.maps.Animation.BOUNCE);
			
			
			var locationInput = document.getElementById('txtLocation');
			autocomplete = new google.maps.places.Autocomplete(locationInput);
			autocomplete.bindTo('bounds', $scope.map);
			
			autocomplete.addListener('place_changed', function() {
				var place = autocomplete.getPlace();
			});

			$scope.markers = [];
			
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
		MapService.getUserLocation(getUserLocationResponseHandler);		
	};

	$scope.searchEventsCurrentLoc();

});