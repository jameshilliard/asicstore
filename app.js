var argv = require('optimist')
      .usage('Usage: $0 -p [port]')
      .default({'p':8000})
      .argv;

var express = require('express');
var async = require('async');

var mongoSession = require('connect-mongo')(express);
var passport = require('passport');
var moment = require('moment');
var db = require('./database');
var config = require('./config.json');

db.startup();

var app = express();

app.configure(function(){
  app.set('view engine','html');
  app.set('views', __dirname + '/views');
  app.enable('view cache');
  app.engine('html',require('hogan-express'));
  app.set('layout', 'layout');
  app.enable("jsonp callback");

  app.use(express.favicon());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  
  app.use(express.session({
    store: new mongoSession({url:config.connection}),
    cookie: { maxAge: new Date(Date.now() + 181440000)},
    secret: config.cookie_secret
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
});

require('./router')(app,passport);

app.listen(argv.p);

console.log("Shop Started");

process.on('uncaughtException', function(err) {
  console.log(err);
});
