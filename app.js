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
var task_history= require('./modules/task_history');
var Schema = mongoose.Schema;

app.use(express.static("public"));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'SD123890',cookie:{maxAge:60000000}}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', __dirname + '/views');

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

app.get("*",function(req,res,next){
    // put user into res.locals for easy access from templates
  app.locals.user = req.user || null;
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
     res.render('index.jade');
});

app.get("/getTab",isLoggedIn,function (req,res) {
        res.render("calenderView.jade",{user:req.user});
});  
app.get("/myReport",isLoggedIn,function (req,res) {
        res.render("singleReport.jade");
});  
app.get("/adminReport",isLoggedIn,function (req,res) {
        res.render("fullReport.jade");
}); 
app.get("/getTaskList",isLoggedIn,function(req,res){
  console.log(req.query.start);
  var start_date=new Date(req.query.start);
  var end_date=new Date(req.query.end);
  var fromDate=("0" + (start_date.getMonth() + 1)).slice(-2)+"/"+("0" + start_date.getDate()).slice(-2)+"/"+start_date.getFullYear();
  var  endDate=("0" + (end_date.getMonth() + 1)).slice(-2)+"/"+("0" + end_date.getDate()).slice(-2)+"/"+end_date.getFullYear();
  task_history.find({uname:req.user.name,date:{$gt:fromDate,$lt:endDate}},function(err,docs){
    var events=[];
     if (!err){ 
      docs.forEach(function(el){
        events.push({"title":el.subid+" - "+el.tasktype,start:el.date,"id":el._id});
      })
       res.send(events);
    } 
    else{
      console.log(err);
    }
  });
});
app.get("/getmytasklist",isLoggedIn,function(req,res){
  task_history.find({uname:req.user.name},function(err,docs){
    var events=[];
     if (!err){ 
      res.send(docs);
    } 
    else{
      res.send("Cannot Read docs");
    }
  });
});

app.get("/gettaskbyid",isLoggedIn,function(req,res){
    task_history.findById(req.query.did,function(err,doc){
      if(err){
        res.send("Error");
      }else{
        res.send(doc);
      }
    })
});
app.get("/logout",function(req,res){
  req.session.destroy();
req.logout(); 
res.redirect('/');
});
app.post('/postDB', function (req, resp) {
  var newUser=new User();
      newUser.name=req.body.name;
    newUser.password=newUser.encpass(req.body.pass);
    newUser.email=req.body.email;
    newUser.adminUser=0;
  newUser.save(function(err) {
    if (err){
      console.log("Error on save");
      console.log(err);
    }else{
      console.log('User saved successfully!');
      resp.render('login.jade', {succ:'Registration completed successfully.! Please login '});
    }
  });
});
app.post('/addNewTask',isLoggedIn,function(req,resp){
  var newTask=new task_history();
  newTask.subid=req.body.subid;
  newTask.tasktype=req.body.tasktype;
  newTask.furl=req.body.furl;
  newTask.fname=req.body.fname;
  newTask.date=req.body.date;
  newTask.notes=req.body.notes;
  newTask.mins=req.body.mins;
  newTask.uname=req.user.name;
  newTask.days=req.body.days;
  newTask.save(function(err) {
    if (err){
      console.log("Error on save");
      console.log(err);
       resp.status(500).send('Something broke!')
    }else{
      console.log('Task Added!');
      resp.send('Added');
    }
  });
});
app.post("/updateTask",isLoggedIn,function(req,res){
   body = req.body;
   //console.log(req.body);
  task_history.findById(req.body._id, function(error, task) {
      if(!task) {
        return res.status(404).json({
          message: 'Course with id ' + id + ' can not be found.'
        });
      }else{
        if(task.uname===req.user.name){
          var newTask={};
          newTask.subid=req.body.subid;
          newTask.tasktype=req.body.tasktype;
          newTask.furl=req.body.furl;
          newTask.fname=req.body.fname;
          newTask.date=req.body.date;
          newTask.notes=req.body.notes;
          newTask.mins=req.body.mins;
          newTask.days=req.body.days;
           task.update(newTask, function(error, utask) {
            if(error){
              //console.log(error);
              return res.status(404).json({
                message: 'Cannot Update Error'
              });
            }else{
              res.send("Updated");
            }
          });               
        }else{
           return res.status(404).json({
            message: 'Auth Error'
          });
        }
      }
  });
});
app.delete("/deleteById/:id/remove",isLoggedIn,function(req,res){
    //console.log(req.params.id);
    task_history.findById(req.params.id, function(error, task) {
      if(!task) {
        return res.status(404).json({
          message: 'Course with id ' + id + ' can not be found.'
        });
      }else{
        if(task.uname===req.user.name){
          task_history.findByIdAndRemove(req.params.id,function(err,resp){
            if(!err){
               res.send("Deleted..!");
            }else{
               res.send("Cannot Delete");
            }
          })
        }else{
            res.send("Auth error on  Delete");
        }
      }
    });

    });
app.get("/getUserList",isAdmin,function(req,res){
  console.log(req.query.us);
  User.find({name:{$regex : "^" + req.query.us}},{name:1,_id:0},function(err,list){
    if(err){
            var da={};
      console.log(err);
      res.send(da);
    }else{
      var da={};
      list.forEach(function(el){console.log(da[el.name]=null);});
      console.log(da);
      res.send(da);
    }
  });
});
app.get("/efgeditor",isAdmin,function(req,res){
  res.render("efgEdit.jade");
});
/** Task Admin api Statrs here **/

//Admin api for getting all task list
app.get("/api/admin/task/",isAdmin,function(req,res){
  var total_res=0;
  var curFind = task_history.find({});
  curFind.count(function (e, count) {
     total_res=count;
     //Create pagination using skip and limit query
    curFind.skip(req.query.pageno*20).limit(20).exec('find',function(err, result) {
      res.send({"total":total_res,"doc":result});
    });

  });
});

//Get Single document for task collection using document id
app.get("/api/admin/task/:docId",isAdmin,function(req,res){
    task_history.findById(req.params.docId,function(err,doc){
      if(!err){
        res.send(doc);
      }else{
        res.status(500);
        res.send("Error on reading Documents");
      }
    })
});

app.put("/api/admin/task/:docId/",isAdmin,function(req,res){
  console.log(req.body.name);
  task_history.findById(req.params.docId, function(error, task) {
      if(!task) {
        return res.status(404).json({
          message: 'Course with id ' + id + ' can not be found.'
        });
      }else{
          var newTask={};
          newTask.subid=req.body.subid;
          newTask.tasktype=req.body.tasktype;
          newTask.furl=req.body.furl;
          newTask.fname=req.body.fname;
          newTask.date=req.body.date;
          newTask.notes=req.body.notes;
          newTask.mins=req.body.mins;
          newTask.days=req.body.days;
          task.update(newTask, function(error, utask) {
            if(error){
              return res.status(404).json({
                message: 'Cannot Update Error'
              });
            }else{
              res.send("Updated");
            }
          });               
        }
  });
});
app.put("/api/admin/task/:docId/updateefg/:efg",isAdmin,function(req,res){
  var updateData={};
    updateData.efg=req.params.efg;
   task_history.findByIdAndUpdate(req.params.docId, updateData, { new: true }, function(error, task) {
      if(!error){
        res.send("Updated");
      }else{
         res.send("Error");
      }
   });
});
app.delete("/api/admin/task/:docId",isAdmin,function(req,res){
   task_history.findByIdAndRemove(req.params.docId,function(err,resp){
        if(!err){
           res.send("Deleted..!");
        }else{
           res.send("Cannot Delete");
        }
   });
});
app.get("/api/admin/searchbydate/:mm/:dd/:yyyy",isAdmin,function(req,res){
  var searchDate=req.params.mm+"/"+req.params.dd+"/"+req.params.yyyy;
  task_history.find({date:searchDate},function(err,docs){
    if(!err){
      res.send(docs)
    }else{
      res.send("Error ");
    }
  });
 
});
app.post("/api/admin/searchfilter/:pageno/",isAdmin,function(req,res){
    var query=req.body;
    console.log(query);
    var search_result= task_history.find(query);
    search_result.count(function (e, count) {
       total_res=count;
       //Create pagination using skip and limit query
      search_result.skip(req.params.pageno*10).limit(10).exec('find',function(err, result) {
        res.send({"total":total_res,"doc":result});
      });

  });
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.render('login.jade', {error:'Please Login to view this page'});
}
function isAdmin(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&app.locals.user.adminUser===1)
        return next();
    // if they aren't redirect them to the home page
    res.status(403).send("Auth Error");
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


app.post('/loginService',passport.authenticate('local-login', {
    successRedirect : '/getTab', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // 
}));

app.listen(3002,function(){
  console.log("connecting..");
  mongoose.connect('mongodb://localhost/students');
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("Connected to mongo..");
    });
});
console.log("server is running");