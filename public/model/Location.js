function Location() {
	this.latitude = 1;
	this.longitude = 1;
	this.addressLine1 = "";
	this.addressLine2 = "";
	this.city = "";
	this.state = "";
	this.country = "";
	this.postal = "";
}

Location.prototype.setLatLong = function(lat, long){
	this.latitude = lat;
	this.longitude = long;
};

Location.prototype.getParamsForSearch = function(params){
	params["location.latitude"] = this.latitude;
	params["location.longitude"] = this.longitude; 
	params["location.within"] = 5 + 'mi';
	return params;
};

var getLocation = function(address){
	return getLocationFromEventbriteResponse(address);
};

var getLocationFromEventbriteResponse = function(address){
	if (!address)
		return new Location();
	
	var location = new Location();
	location.addressLine1 = getStringObjectIfAvailable(address.address_1);
	location.addressLine2 = getStringObjectIfAvailable(address.address_2);
	location.city = getStringObjectIfAvailable(address.city);
	location.state = getStringObjectIfAvailable(address.region);
	location.country = getStringObjectIfAvailable(address.country);
	location.postal = getStringObjectIfAvailable(address.postal_code);
	return location;
};