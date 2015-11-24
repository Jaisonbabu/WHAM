var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.use(cookieParser())
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
			country: String, username: String
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
			})
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

app.post('/getUserDetails', function(req, res)
		{
		console.log(req.body.uname);
		res.json(req.body);
		});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ip);