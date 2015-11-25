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
	this.categoryId;
	this.venue = new Venue();	
}

var getEvent = function(apiEvent){
	return getMappedEventFromEventbriteResponse(apiEvent);
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
	eventObj.categoryId = getStringObjectIfAvailable(event.category_id);
	eventObj.venue = getVenue(event.venue); 
	return eventObj;
};

var getEvents = function(apiEventResponse,username){
	console.log(username);
	var eventsObj = [];
	for(var i in apiEventResponse){
		var event = getEvent(apiEventResponse[i]);		
		eventsObj.push(event);
	}

	if(username != null){
		return getUserPrefEvents(eventsObj,username);
	}
	else{
		return eventsObj;
	}
};

var getUserPrefEvents = function(events,username){
	var userDetails = null;
	var userPrefcategory = [];
	var userPrefEvents = [];
	var userNonPrefEvents = [];
	var userDislikedVenues = [];

	userDetails = getUserDetails(username);
	userPrefcategory = userDetails.liked_categories;
	userDislikedVenues = userDetails.disliked_venues;


	for (var i in events){
		for (var j in userPrefcategory){
			for (var k in userDislikedVenues){
				if(events.category_id == j || events.venue.venueId != k)
					userPrefEvents.push(i);
				else if(events.venue.venueId == k){
					continue;
				}
				else
					userNonPrefEvents.push(i);
			}
		}
	}
	
	return userPrefEvents.concat(userNonPrefEvents);
};