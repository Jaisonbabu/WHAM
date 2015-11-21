function Marker(event, mapObj){
	this.marker = new google.maps.Marker({
		map : mapObj,
		position : new google.maps.LatLng(event.venue.location.latitude,
				event.venue.location.longitude),
		zoom : 12,
		id : event.id,
		name : event.name,
		venue_name : event.venue.name,
		address : event.venue.location.addressLine1,
		city : event.venue.location.city,
		fullPostalCode : event.venue.location.postal,
		state : event.state,
		startTimestamp : event.startTime,
		endTimeStamp : event.endTime,
		imageUrl : event.imageUrl,
		content : '<div class="infoWindowContent">' + event.venue.name
				+ "<br/>" + event.venue.location.addressLine1 + "\n,"
				+ event.venue.location.city + "\n,"
				+ event.venue.location.state + '<br/>'
				+ new Date(event.startTime).format('M jS, Y - g:i A') + '</div>'
	});
	addListener(this.marker, mapObj);
}

var infoWindow = new google.maps.InfoWindow({ maxWidth: 250 });

var addListener = function(marker, mapObj) {	
	google.maps.event.addListener(marker, 'mouseover', function() {
		infoWindow.setContent('<h4>' + marker.name + '</h4>' + marker.content);
		infoWindow.open(mapObj, marker);
	});
};