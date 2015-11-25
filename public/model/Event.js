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

var getEvents = function(apiEventResponse,username,userObj){
	console.log(username);
	console.log(userObj);
	var eventsObj = [];
	for(var i in apiEventResponse){
		var event = getEvent(apiEventResponse[i]);		
		eventsObj.push(event);
	}
	console.log(eventsObj);
	if(username != null){
		return getUserPrefEvents(eventsObj,userObj);
	}
	else{
		return eventsObj;
	}
};

var getUserPrefEvents = function(events,userDetails){

	var userPrefEvents = [];
	var userNonPrefEvents = [];
	
	console.log(userDetails.liked_categories);
	console.log(userDetails.disliked_venues);

	if(userDetails.liked_categories == null){
		var userPrefcategory = [];
	}
	else
		var userPrefcategory = userDetails.liked_categories;

	if(userDetails.disliked_venues == null){
		var userDislikedVenues = [];
	}
	else
		userDislikedVenues = userDetails.disliked_venues;

	if(userDetails.disliked_venues == null && userDetails.liked_categories == null)
		return events;

	console.log("userDislikedVenues"+ userDislikedVenues);
	console.log(userPrefcategory);



	for (var i in userPrefcategory){
		for (var j in events){
			//if(events.category_id == j || events.venue.venueId != k)
			console.log(events[j].categoryId);
			console.log(userPrefcategory[i]);
			if(events[j].categoryId == userPrefcategory[i]){
				userPrefEvents.push(events[j]);	
			}
			else{
				userNonPrefEvents.push(events[j]);
			}

		}
	}
	console.log(userPrefEvents);
	console.log(userPrefEvents);

	return userPrefEvents.concat(userNonPrefEvents);
};
