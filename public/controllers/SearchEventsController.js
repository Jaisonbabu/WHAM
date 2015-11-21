app.controller('SearchEventsController', function($anchorScroll, $scope,$http, $timeout, EventsService, MapService){	

	var params = {};
	$scope.eventResponse = 0;
	$scope.apiResponse = 0;
	$scope.locationResponse = 0;

	var getLocationResponseHandler = function(response){
		//TODO: handle response statuses
		//if (response!=null && response)
		if(response.status = 200){
			if (response.results.length > 0){
				var location = new Location();
				location.setLatLong(
						response.results[0].geometry.location.lat,
						response.results[0].geometry.location.lng);
				params = location.getParamsForSearch(params);
				EventsService.fetchEvents(params,searchEventsResponseHandler(location.latitude, location.longitude));
			}
			else{
				
				$scope.eventResponse = 0;
				$scope.locationResponse = 1;
			}
		}
		else{
			$scope.apiResponse = 1;
		}
	};

	var getUserLocationResponseHandler = function(position) {
		var location = new Location();
		location.setLatLong(
				position.coords.latitude,
				position.coords.longitude);
		params = location.getParamsForSearch(params);
		//$scope.userLoc = new google.maps.LatLng(location.latitude, location.longitude);
		EventsService.fetchEvents(params, searchEventsResponseHandler(location.latitude, location.longitude));
	};

	select = document.getElementById( 'categories' );
	for( category in $scope.categories ) {
		select.add( new Option( category, $scope.categories[category]) );
	};	

	$("#btnSearch").on("click", function(){
		var query = $("#txtQuery");
		var location = $("#txtLocation");
		var category  = $("#categories");

		// To delete q from the params if q already exists in params
		if(query.val()=="")
			delete params["q"];

		if (query!=null && query.val()!=""){
			params["q"] = query.val();
		}
		if (category!=null && category.val()!="" && category.val()!="Select Category"){
			params["categories"] = category.val();
		}
		if (location!=null && location.val()!=""){

			MapService.getLocationForAddress(location.val(), getLocationResponseHandler);

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

			var status = response.status; 
			if(status == 200) {

				var events = getEvents(response.data.events);
				$scope.events = events;

				if($scope.events.length == 0){
					$scope.eventResponse = 1;
					$scope.locationResponse = 0;
				}
				else{
					$scope.eventResponse = 0;
				}

				var mapOptions = {
						zoom: 12,
						center: new google.maps.LatLng(lt, lg),
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

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
					optimized: true,
					position: mapOptions.center,
					title: 'You are here',
					visible: true,
					//labelClass: "userLoc",
				});

				userMarker.setAnimation(google.maps.Animation.BOUNCE);

				var locationInput = document.getElementById('txtLocation');
				autocomplete = new google.maps.places.Autocomplete(locationInput);
				autocomplete.bindTo('bounds', $scope.map);

				autocomplete.addListener('place_changed', function() {
					var place = autocomplete.getPlace();
				});

				$scope.markers= [];
				for (i = 0; i < events.length; i++) {
					var marker = new Marker(events[i], $scope.map).marker;
					$scope.markers.push(marker);
				}

				$scope.openInfoWindow = function(event, selectedMarker) {
					event.preventDefault();
					google.maps.event.trigger(selectedMarker, 'mouseover');
				};
			}
			else{
				$scope.apiResponse = 1;
			};
		};
	};

	$scope.searchEventsCurrentLoc = function(){		
		MapService.getUserLocation(getUserLocationResponseHandler);		
	};
	
	// Initial call to display home page
	$scope.searchEventsCurrentLoc();

});