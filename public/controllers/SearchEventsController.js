app.controller('SearchEventsController', function($anchorScroll,$rootScope, $scope,$http, $timeout, EventsService, MapService, DbService){	

	var params = {};
	$scope.eventResponse = 0;
	$scope.apiResponse = 0;
	$scope.locationResponse = 0;

	var getLocationResponseHandler = function(response){
		response = getObjectIfAvailable(response);
		if(response && response.status == 200){
			results = getObjectIfAvailable(response.data.results);
			if (results && results.length > 0 && 
					getObjectIfAvailable(results[0].geometry.location)){
				var location = new Location();
				location.setLatLong(
						results[0].geometry.location.lat,
						results[0].geometry.location.lng);
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
		$scope.userLoc = new google.maps.LatLng(location.latitude, location.longitude);
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

		// To delete old q from the params
		if(query.val()=="")
			delete params["q"];

		if (query!=null && query.val()!=""){
			params["q"] = query.val();
		}
		
		if (category!=null && category.val()!="" && category.val()!="All Categories"){
			params["categories"] = category.val();
		}
		// To delete old categories from the params
		if(category.val()=="")
			delete params["categories"];
		
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
			response = getObjectIfAvailable(response); 
			if(response && response.status == 200) {

				$scope.locationResponse = 0;
				
				var data = getObjectIfAvailable(response.data);
				if (!data){
					$scope.eventResponse = 1;					
					return;
				}
				
				var events = getObjectIfAvailable(data.events); 
				if(events.length == 0){
					$scope.eventResponse = 1;
					return;
				}
				else{
					$scope.eventResponse = 0;
				}

				events = getEvents(events,$rootScope.currentUser);
				$scope.events = events; // $scope.events not used anywhere 

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
				for (var i = 0; i < events.length; i++) {
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

//	var user = new UserCredential();
//	user.setCredentials('username','password2');
//	DbService.updatePassword(user, function(obj, stat){		
//		console.log("updatePass "+JSON.stringify(obj));
//	});
});
