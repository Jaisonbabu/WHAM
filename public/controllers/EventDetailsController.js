app.controller('EventDetailsController', function($scope, $rootScope,$location, EventsService, $routeParams){

	var searchEventsResponseHandler = function(response) {
		$scope.event = getEvent(response);
		var mapOptions = {
				zoom: 12,
				center: new google.maps.LatLng($scope.event.venue.location.latitude, $scope.event.venue.location.longitude),
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
			position: $rootScope.userLoc,
			title: 'You are here',
			visible: true,
		});

		userMarker.setAnimation(google.maps.Animation.BOUNCE);
		var marker = new Marker($scope.event, $scope.map).marker;
	}

	EventsService.fetchEventById($routeParams.eventId, searchEventsResponseHandler);
})