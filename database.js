var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');
var Product = require('./models/product');
var Order = require('./models/order');

passport.use(new LocalStrategy({usernameField: 'btc'},function(btc, password, done) {User.authenticate(btc, password, function(err, user) {return done(err, user);});}));
passport.serializeUser(function(user, done) {done(null, user.btc);});
passport.deserializeUser(function(btc, done) {User.findByBTC(btc, function (err, user) {done(err, user);});});

module.exports = {
  startup: function() {
    mongoose.connect('mongodb://localhost:27017/asicstore');
    mongoose.connection.on('open', function() {
      console.log('Connected to database!');
    });
  },

  getProducts: function(callback) {
    Product.find({},function(err,products) {
      console.log(products);
      callback(null,products);
    });
  },
  
  closeDB: function() {
    mongoose.disconnect();
  }
};


