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

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/Shopping';
mongoose.connect(connectionString);

var UserSchema = new mongoose.Schema(
		{ 
			firstname: String, lastname: String, email: String, phone: Number, address: String, 
			country: String, username: String, password : String
		});

var UserDetail = mongoose.model("Userdetail", UserSchema);

passport.use(new LocalStrategy(
		function(username, password, done)
		{
			UserDetail.findOne({username:username, password:password}, function(err, user){
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

app.get('/user/login', function(req,res){
	UserDetail.find(function(err,users){
		res.json(users);
	})
})

app.post('/user/login', passport.authenticate('local'), function(req, res)
		{
	res.send(req.user);
		});

app.post('/user/logout', function(req, res)
		{
	req.logOut();
	res.sendStatus(200);
		});

//ajax target for checking username
app.post('/user/checkUsername', function(req, res) {
	var username = req.body.username;
	// check if username is already taken - query your db here
	var usernameTaken = false;
	UserDetail.findOne({username: username}, function(err,user){
		if(user)
		{
			usernameTaken = true;
		}
		if (usernameTaken) {
			res.json(403, {
				isTaken: true
			});
			return
		}
		else
		{
			// looks like everything is fine
			res.send(200);
		}
	})
});

//ajax target for checking password
app.post('/user/checkPassword', function(req, res) {
	console.log('success');
	var username = req.body.username;
	console.log(req.body.username);
	// check if password matches
	var noMatch = false;
	UserDetail.findOne({username: username}, function(err,user){
		if(user.password != req.body.password)
		{
			noMatch = true;
		}
		if (noMatch) {
			res.json(403, {
				noMatch: true
			});
			return
		}
		else
		{
			// looks like everything is fine
			res.send(200);
		}
	})
});

app.put('/user/updateUser/:id', function(req,res){
	UserDetail.findById(req.params.id, function(err, data){
		data.firstname = req.body.firstname;
		data.lastname = req.body.lastname;
		data.address = req.body.address;
		data.country = req.body.country;
		data.email = req.body.email;
		data.password = req.body.password;
		data.phone = req.body.phone;
		data.save(function(err, result){
			UserDetail.findById(req.params.id, function(err, doc){
				res.json(doc);
			})
		})
	})
});


app.post('/user/register', function(req,res){
	var user = new UserDetail(req.body);
	user.save(function (err, doc){
		res.json(err);
	})
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ip);