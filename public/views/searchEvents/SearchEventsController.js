app.controller('SearchEventsController', function($anchorScroll, $scope,$http, $timeout, EventsService){	

	var params = {};

	$("#btnSearch").on("click", function(){
		var query = $("#txtQuery");
		var location = $("#txtLocation");		
		if (query!=null && query.val()!=""){
			params["q"] = query.val();
		}
		if (location!=null && location.val()!=""){

			/*dummy values for now*/
			//var initialLat = 42.12;
			//var initialLon = -71.05;
			var initialLat = 51.5;
			var initialLon = -0.1914;
			var address = '360 Huntington avenue';
			var postalCode = '21058';
			/*dummy values for now*/
		}
		else{

		}		
		$scope.searchEvents(params);
	});

	var searchEventsResponseHandler = function(response){
		$scope.events = response.events;
		console.log(response.events);

		var events = [];
		var lat, long;

		for(var i in $scope.events){
			console.log(i);
			var event = {
					name : $scope.events[i].name.text, 
					imageUrl : '',
			}
			if($scope.events[i].logo){
				event.imageUrl = $scope.events[i].logo.url;
			}

			if($scope.events[i].venue) {
				event.lat = $scope.events[i].venue.latitude;
				event.long = $scope.events[i].venue.longitude;
				event.address = $scope.events[i].venue.address.address_1+',';
				event.city = $scope.events[i].venue.address.city+',';
				event.state = $scope.events[i].venue.address.region;
				event.fullPostalCode =  $scope.events[i].venue.address.postal_code;
				lat = $scope.events[i].venue.latitude;
				long = $scope.events[i].venue.longitude;
			}

			events.push(event);
		}

		var mapOptions = {
				zoom: 10,
				center: new google.maps.LatLng(lat, long),
				mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

		$scope.markers = [];

		var infoWindow = new google.maps.InfoWindow();

		var createMarker = function (info){

			var marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(info.lat, info.long),
				zoom : 12,
				name : info.name,
				address : info.address,
				city : info.city,
				fullPostalCode : info.fullPostalCode,
				state : info.state
			});
			marker.content = '<div class="infoWindowContent">' + info.address + "\n,"+ info.city+"\n,"+ info.state + '</div>';

			google.maps.event.addListener(marker, 'mouseover', function(){
				infoWindow.setContent('<h3>' + marker.name + '</h3>'+ marker.content);
				infoWindow.open($scope.map, marker);
			});

			$scope.markers.push(marker);

		}  

		for (i = 0; i < events.length; i++){
			createMarker(events[i]);
		}
		$scope.markers = [];

		var infoWindow = new google.maps.InfoWindow();

		var createMarker = function (info){

			var marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(info.lat, info.long),
				zoom : 12,
				name : info.name,
				address : info.address,
				city : info.city,
				state : info.state,
				fullPostalCode : info.fullPostalCode,
				imageUrl : info.imageUrl
			});
			marker.content = '<div class="infoWindowContent">' + info.address + "\n"+ info.city+"\n"+ info.state + '</div>';

			google.maps.event.addListener(marker, 'click', function(){
				infoWindow.setContent('<h3>' + marker.name + '</h3>'+ marker.content);
				infoWindow.open($scope.map, marker);
			});

			$scope.markers.push(marker);

		}  

		for (i = 0; i < events.length; i++){
			createMarker(events[i]);
		}

		$scope.openInfoWindow = function(e, selectedMarker){
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'click');
		}
	};

	//params = {"location.latitude": "36.56", "location.longitude": "-121.95"};

	$scope.searchEvents = function(params){
		EventsService.fetchEventsByLocation(params, searchEventsResponseHandler);
	};

	$scope.searchEvents(params);

})
