var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/WHAM';
mongoose.connect(connectionString);

var LoginSchema = new mongoose.Schema(
		{ 
			username: String, 
			password: String
		}, 
		{ collection: 'UserCredentials' });

var LoginDetail = mongoose.model("UserCredentials", LoginSchema);

var UserSchema = new mongoose.Schema(
		{ 
			firstname: String, lastname: String, email: String, address_1: String,
			address_2: String, city: String, state: String, postal: String,
			country: String, liked_categories: [], disliked_venues: [], 
			security_question: String, security_answer: String,
			username: String, dob : Date, gender : String
		},
		{ collection: 'UserDetails' });

var UserDetail = mongoose.model("UserDetails", UserSchema);

passport.use('login', new LocalStrategy(
		function(username, password, done)
		{
			LoginDetail.findOne({'username':username, 'password':password}, function(err, user){
				if(user){
					return done(null, user);
				}
				return done(null, false, {message: 'Unable to login'});
			});
		}));

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

var auth = function(req, res, next)
{
	if (!req.isAuthenticated())
		res.send(401);
	else
		next();
};

app.get('/loggedin', function(req, res)
		{
	res.send(req.isAuthenticated() ? req.user : '0');
		});

app.post('/login', passport.authenticate('login'), function(req, res)
		{
	res.send(req.user);
		});

app.post('/logout', function(req, res)
		{
	req.logOut();
	res.sendStatus(200);
		});

app.post('/user/details', function(req,res){
	UserDetail.findOne({'username': req.body.username}, function(err,obj){
		res.json(obj);		
	});
});

app.put('/user/updateDetails', function(req,res){
	UserDetail.findOne({username: req.body.username}, function(err,obj){
		obj = mapUserObjToDbObj(obj, req.body);
		obj.save(function(err, userObj){
			if (err){
				console.log("Error while saving data to UserDetails: " + err);
			}
			else
				res.json(userObj);
		});		
	});	
});

app.post('/user/updatePassword', function(req,res){
	LoginDetail.findOne({username: req.body.username}, function(err,obj){
		obj.password = req.body.password;
		obj.save(function(err, userObj){
			if (err){
				console.log("Error while updating password in UserCredentials: " + err);
			}
			else
				res.json(userObj);
		});		
	});	
});

app.post('/user/addNewDetails', function(req,res){
	var obj = new UserDetail();
	obj.username = req.body.username;
	obj = mapUserObjToDbObj(obj, req.body);	
	UserDetail.findOne({username: req.body.username}, function(err,getobj){
		if(getobj == null || getobj == undefined){			
			obj.save(function (err) {
				if (err) return function(){ console.log("Error while adding new user to UserDetails: " + err); };
				UserDetail.findById(obj, function (err, doc) {
					if (err) return function(){ console.log("Error while retrieving newly added user from UserDetails: " + err); };
					console.log(doc);
					res.json(doc);
				});
			});
		}
		else {
			res.json(getobj);
		}
	});
});

app.post('/user/addNewLogin', function(req,res){
	var obj = new LoginDetail();
	obj.username = req.body.username;
	obj.password = req.body.password;	
	LoginDetail.findOne({username: req.body.username}, function(err,getobj){
		if(getobj == null || getobj == undefined){
			obj.save(function (err) {
				if (err) return function(){ console.log("Error while adding new user to UserCredentials: " + err); };
				LoginDetail.findById(obj, function (err, doc) {
					if (err) return function(){ console.log("Error while retrieving newly added user from UserCredentials: " + err); };
					console.log(doc);
					res.json(doc);
				});
			});
		}
		else{
			res.json(getobj);
		}
	});
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ip);

var getStringObjectIfAvailable = function (obj){
	if (obj != null && obj != undefined)
		return obj;
	return "";
};

var getObjectIfAvailable = function (obj){
	if (obj != null && obj != undefined)
		return obj;
	return null;
};

var mapUserObjToDbObj = function(user, body){
	if (body == null || body == undefined)
		return user;
	user.firstname = getStringObjectIfAvailable(body.firstname);
	user.lastname = getStringObjectIfAvailable(body.lastname);
	user.email = getStringObjectIfAvailable(body.email);
	user.gender = getStringObjectIfAvailable(body.gender);
	user.dob = getStringObjectIfAvailable(body.dob);
	user.liked_categories = getObjectIfAvailable(body.liked_categories);
	user.disliked_venues = getObjectIfAvailable(body.disliked_venues); 
	user.security_question = getStringObjectIfAvailable(body.security_question);
	user.security_answer = getStringObjectIfAvailable(body.security_answer);
	return user;
};
