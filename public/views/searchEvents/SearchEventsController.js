app.controller('SearchEventsController', function($anchorScroll, $scope,$http, $timeout, EventsService){	

	var params = {};
	var d = new Date();
	var utcTime = d.getUTCFullYear()+'-'+d.getUTCMonth()+'-'+d.getUTCDate()+'T'+d.getUTCHours()+':'+d.getUTCMinutes()+':'+d.getUTCSeconds()+'Z';

	var time = {
			"timezone": "America/New_York",
			"utc": utcTime
	};

	/*var timeZone = {start_date:{
		range_start :{}
	}};
	timeZone.start_date.range_start=time;*/

	//params.start_date.range_start = time;

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

	var searchEventsResponseHandler = function(response) {
		$scope.events = response.events;
		console.log(response.events);

		var events = [];
		var lat, long;

		for(var i in $scope.events){
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
				event.startTimestamp = $scope.events[i].start.local;
				lat = $scope.events[i].venue.latitude;
				long = $scope.events[i].venue.longitude;
			}

			events.push(event);
		}

		//lat = pos.lat;
		//long = pos.lng;

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
				state : info.state,
				startTimestamp : info.startTimestamp
			});

			var date = new Date(info.startTimestamp);
			marker.content = '<div class="infoWindowContent">' + info.address + "\n,"+ info.city+"\n,"+ info.state + '<br/>'+date.format('M jS, Y - g:i A')+'</div>';

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
				imageUrl : info.imageUrl,
				startTimestamp : info.startTimestamp
			});

			var date = new Date(info.startTimestamp);
			marker.content = '<div class="infoWindowContent">' + info.address + "\n"+ info.city+"\n"+ info.state + '<br/>'+date.format('M jS, Y - g:i A')+'</div>';

			google.maps.event.addListener(marker, 'mouseover', function(){
				infoWindow.setContent('<h3>' + marker.name + '</h3>'+ marker.content);
				infoWindow.open($scope.map, marker);
			});

			$scope.markers.push(marker);

		}  

		for (i = 0; i < events.length; i++){
			createMarker(events[i]);
		}

		$scope.openInfoWindow = function(e, selectedMarker) {
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'mouseover');
		}
	};

	$scope.searchEvents = function(params){
		var pos = {};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
				};
				console.log('pos = '+ pos.lat);
				params["location.latitude"] = pos.lat;
				params["location.longitude"] = pos.lng;

				//infoWindow.setPosition(pos);
				//infoWindow.setContent('Location found.');
				//map.setCenter(pos);
				console.log(pos.lat+'---'+pos.lng);
				console.log('params ='+params['location.latitude']);
				EventsService.fetchEventsByLocation(params, searchEventsResponseHandler);
			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, infoWindow, map.getCenter());
		}

		function handleLocationError(browserHasGeolocation, infoWindow, pos) {
			infoWindow.setPosition(pos);
			infoWindow.setContent(browserHasGeolocation ?
					'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.');
		}

	};

	$scope.searchEvents(params);

})
