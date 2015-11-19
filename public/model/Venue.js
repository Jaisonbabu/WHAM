function Venue()  { 
	this.name = "";
	this.description = "";
	this.location = new Location();
}

var getVenue = function(venue){
	return getVenueFromEventbriteResponse(venue);
};

var getVenueFromEventbriteResponse = function(venue){
	var venueObj = new Venue();
	venueObj.name = getStringObjectIfAvailable(venue.name);
	venueObj.location = getLocation(venue.address);
	venueObj.location.setLatLong(venue.latitude, venue.longitude);
	return venueObj;
};