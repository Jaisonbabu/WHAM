function User() {
	this.username = "";
	this.firstname = "";
	this.lastname = "";
	this.email = "";
	this.location = new Location();
	this.liked_categories = "";
	this.disliked_venues = "";
	this.security_question = "";
	this.security_answer = "";
}

User.prototype.setUser = function(username, firstname, lastname, email, location, liked_categories, 
		disliked_venues, security_question, security_answer) {
	this.username = username;
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.location = location;
	this.liked_categories = liked_categories;
	this.disliked_venues = disliked_venues;
	this.security_question = security_question;
	this.security_answer = security_answer;
};
