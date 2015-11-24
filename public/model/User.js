function User() {
	this.firstname = "";
	this.lastname = "";
	this.location = new Location();
	this.liked_categories = "";
	this.disliked_venues = "";
	this.security_question = "";
	this.security_answer = "";
}

User.prototype.setUser = function(firstname, lastname, location, liked_categories, 
		disliked_venues, security_question, security_answer) {
	
	this.firstname = firstname;
	this.lastname = lastname;
	this.location = location;
	this.liked_categories = liked_categories;
	this.disliked_venues = disliked_venues;
	this.security_question = security_question;
	this.security_answer = security_answer;
	
}
