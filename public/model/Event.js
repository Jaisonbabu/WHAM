function Event(){
	this.id;
	this.name;
	this.imageUrl;
	this.description;
	this.startTime;
	this.endTime;
	this.eventUrl;
	this.liked;
	this.capacity;
	this.venue = new Venue();	
}

var getEvent = function(event){
	return getMappedEventFromEventbriteResponse(event);
};

var getMappedEventFromEventbriteResponse = function(event){
	var eventObj = new Event();
	if(getObjectIfAvailable(event.logo)){
		eventObj.imageUrl = getStringObjectIfAvailable(event.logo.url);
	}
	if(getObjectIfAvailable(event.id)){
		eventObj.id = getStringObjectIfAvailable(event.id);
	}
	if(getObjectIfAvailable(event.name)){
		eventObj.name = getStringObjectIfAvailable(event.name.text);
	}
	if(getObjectIfAvailable(event.description)){
		eventObj.description = getStringObjectIfAvailable(event.description.text);
	}
	if(getObjectIfAvailable(event.start)) {
		eventObj.startTime = getStringObjectIfAvailable(event.start.utc);
	}	
	if(getObjectIfAvailable(event.end)) {
		eventObj.endTime = getStringObjectIfAvailable(event.end.utc);
	}
	eventObj.eventUrl = getStringObjectIfAvailable(event.url);
	eventObj.capacity = getStringObjectIfAvailable(event.capacity);
	eventObj.venue = getVenue(event.venue); 
	return eventObj;
};

var getEvents = function(events){
	var eventsObj = [];
	for(var i in events){
		var event = getEvent(events[i]);		
		eventsObj.push(event);
	}
	return eventsObj;
};