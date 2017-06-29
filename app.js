var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

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

var sess; //variable for store session
app.get('/', function(req, res){
  sess = req.session;
  if(sess.username == 'admin'){
    res.redirect('/admin');
  } else {
    res.render('login');
  }
});

app.post('/login', function(req, res){
  sess = req.session;
  if(req.body.username == 'admin' && req.body.password == 'admin'){
    sess.username = req.body.username;
    sess.password = req.body.password;
    res.redirect('/admin');
  } else {
    res.redirect('/')
  }
});

app.get('/admin', function(req, res){
  sess = req.session;
  if(sess.username == 'admin'){
    res.render('index', { username : sess.username });
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

//============= LISTEN SERVER
var port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log('http://localhost:' + port + "/");
});
