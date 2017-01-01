var mongoose = require('mongoose');
var express=require('express');
var app=express(); var db;
var path    = require("path");
var bodyParser = require('body-parser');
var crypto = require('crypto');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var User= require('./modules/db_model');
var Schema = mongoose.Schema;

/*var userSchema = new Schema({
   name: String,
  password: { type: String, required: true },
  email: String
},{ collection : 'stu_info' });

var User = mongoose.model('student', userSchema);*/
app.use(express.static("public"));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'SD123890' }));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', __dirname + '/views');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 passport.serializeUser(function(User, done) {
      done(null, User.id);
  });

    // used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, users) {
        done(err, users);
    });
});

app.get("/",function(req,res){
  console.log("Res");
     res.render('login.jade', {title: 'Hello '});
});
app.get("/register",function(req,res){
  console.log("Res");
     res.render('index.jade', {title: 'Hello ',error:'yes'});
});

app.get("/getTab",isLoggedIn,function (req,res) {
  User.find({},function(err,users){
      if(err){
        console.log(err);
      }else{
        res.send(users);
      }
  });
});  
app.post('/postDB', function (req, resp) {
  console.log(req.body);

  var newUser=new User();
      newUser.name=req.body.name;
    newUser.password=newUser.encpass(req.body.pass);
    newUser.email=req.body.email;
  newUser.save(function(err) {
    if (err){
      console.log("Error on save");
      console.log(err);
    }else{
      console.log('User saved successfully!');
      resp.send('Added');
    }
  });
});
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
passport.use('local-login', new LocalStrategy({
    usernameField : 'name',
    passwordField : 'pass',
    passReqToCallback : true //
  },function(req, name, pass, done) { 
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(pass,'utf8','hex')
    crypted += cipher.final('hex');
    User.findOne({name:name,password:crypted},function(err,users){
      if(err){
        console.log(err);
         return done(err);
      }else{
        if(users){
            return done(null, users);              
    
        }else{
          return done(null, false);

        }
       
      }
  });
  }));
/*app.post('/loginService', function (req, resp) {
  console.log(req.body);
  
  console.log(crypted);
  User.find({name:req.body.name,password:crypted},function(err,users){
    if(err){
      resp.send("<span style='color:red;'>Someting went wrong please connect admin</span>");
    }else{
      console.log(users);
      if(users.length>0){
           var options = {
              maxAge: 1000 * 60 * 15, // would expire after 15 minutes
              httpOnly: true
          }
          resp.cookie('setAuth', 'true', options); 
       //resp.send("<span style='color:green;'>Login success!!</span>");   
     resp.redirect(301,"/getTab");
      }else{
       resp.send("<span style='color:red;'>Login Failed <br>Username or password is invaild</span>");
      }
    }
    
  })
});*/

app.post('/loginService',passport.authenticate('local-login', {
    successRedirect : '/getTab', // redirect to the secure profile section
    failureRedirect : '/' // redirect back to the signup page if there is an error
}));
app.listen(3002,function(){
  console.log("connecting..");
  mongoose.connect('mongodb://localhost/students');
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("Connect to mongo");
    });
});
console.log("server is running");