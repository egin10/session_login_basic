var express = require('express');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var validator = require('express-validator');

var app = express();

//============ VIEW ENGINE
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

//============ USE MIDDLEWARE
app.use(bodyParser.urlencoded({ extended : false }));
app.use(expressSession({
  secret: 'SuperSecret',
  resave: false,
  saveUninitialized: false
}));
app.use(validator());

var sess; //variable for store session
app.get('/', function(req, res){
  sess = req.session;
  if(sess.email == 'egin@example.com'){
    res.redirect('/admin');
  } else {
    res.render('login');
  }
});

app.post('/login', function(req, res){
  req.checkBody('email', 'Email is Invalid!').isEmail();
  var errors = req.validationErrors();
  if(errors){
    res.render('login', { errors: errors });
    return;
  } else {
    sess = req.session;
    if(req.body.email == 'egin@example.com' && req.body.password == 'admin'){
      sess.email = req.body.email;
      res.redirect('/admin');
    } else {
      res.redirect('/');
    }
  }
});

app.get('/admin', function(req, res){
  sess = req.session;
  if(sess.email == 'egin@example.com'){
    res.render('index', { email : sess.email });
  } else {
    res.send("You're not yet Login! <a href='/'>Log In</a>");
  }
});

app.get('/logout', function(req, res){
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('*', function(req, res){
  res.writeHead(404, {"Content-Type":"text/plain"});
  res.end('Page Not Found!');
});

//============= LISTEN SERVER
var port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log('http://localhost:' + port + "/");
});
