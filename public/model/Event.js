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

var getEvents = function(apiEventResponse,username,userObj, queryKeyword, queryCategory){
	var eventsObj = [];
	for(var i in apiEventResponse){
		var event = getEvent(apiEventResponse[i]);		
		eventsObj.push(event);
	}
	if(username != null && queryKeyword == "" && queryCategory == ""){
		return getUserPrefEvents(eventsObj,userObj);
	}
	else{
		return eventsObj;
	}
};

var getUserPrefEvents = function(events,userDetails){

	var userPrefEvents = [];
	var userNonPrefEvents = [];

	if(userDetails.liked_categories.length == 0){
		var userPrefcategory = [];
	}
	else
		var userPrefcategory = userDetails.liked_categories;

	if(userDetails.disliked_venues.length == 0){
		var userDislikedVenues = [];
		var userPref = userPrefEvents;
	}
	else{
		var userPref = [];
		userDislikedVenues = userDetails.disliked_venues;

	}
	if(userDetails.disliked_venues.length == 0 && userDetails.liked_categories.length == 0)
		return events;

	for (var i in userPrefcategory){
		for (var j in events){
			//if(events.category_id == j || events.venue.venueId != k)
			if(events[j].categoryId == userPrefcategory[i]){
				userPrefEvents.push(events[j]);	
			}
			else{
				userNonPrefEvents.push(events[j]);
			}
		}
	}

	for (var i in userDislikedVenues){
		for (var j in userPrefEvents){
			if(userPrefEvents[j].venue.venueId == userDislikedVenues[i]){
				continue;	
			}
			else{
				userPref.push(userPrefEvents[j]);
			}
		}
	}

	return userPref.concat(userNonPrefEvents);
};
