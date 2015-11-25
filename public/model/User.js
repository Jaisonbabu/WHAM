function User() {
	this.username = "";
	this.firstname = "";
	this.lastname = "";
	this.email = "";
	this.location = new Location();
	this.liked_categories = [];
	this.disliked_venues = [];
	this.security_question = "";
	this.security_answer = "";
}

User.prototype.setUser = function(user) {
	
	this.firstname = user.firstname;
	this.lastname = user.lastname;
	this.location = user.location;
	this.liked_categories = user.selection;
	this.disliked_venues = user.disliked_venues;
	this.security_question = user.security_question;
	this.security_answer = user.security_answer;
	
}

