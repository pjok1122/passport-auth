var topic = require('./lib/topic');
var express = require('express');
var bodyParser = require('body-parser');
var app =express();
var session = require('express-session');
var sessionStore = require('./lib/session-store');

var db = require('./lib/db');
var flash = require('connect-flash');

app.use(session({
  secret:"keyboard cat",
  resave:false,
  saveUninitialized:true,
  store: sessionStore
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
passport = require('./lib/passport')(app);

var topicRouter = require('./routes/topic');
var authorRouter = require('./routes/author');
var authRouter = require('./routes/auth')(passport);

app.use(express.static('public'));
app.use('/topic', topicRouter);
app.use('/author', authorRouter);
app.use('/auth', authRouter);
app.get('/', function(req,rsp){
  topic.home(req,rsp);
});

app.listen(3000, function(){});