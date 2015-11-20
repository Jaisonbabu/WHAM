function UserCredential() {
	this.username = "";
	this.password = "";
}

UserCredential.prototype.setCredentials = function(username, password) {
	this.username = username;
	this.password = password;
}