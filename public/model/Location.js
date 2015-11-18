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
}

Location.prototype.getParamsForSearch = function(params){
	params["location.latitude"] = this.latitude;
	params["location.longitude"] = this.longitude; 
	params["location.within"] = 5 + 'mi';
	return params;
};