var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');
var Product = require('./models/product');
var Order = require('./models/order');

passport.use(new LocalStrategy({usernameField: 'btc'},function(btc, password, done) {User.authenticate(btc, password, function(err, user) {return done(err, user);});}));
passport.serializeUser(function(user, done) {done(null, user.btc);});
passport.deserializeUser(function(btc, done) {User.findByBTC(btc, function (err, user) {done(err, user);});});

function searchJSONArray(arr,key,val){
  for(var i=0;i<arr.length;i++){
    if(arr[i][key]==val) {
      return arr[i];
    }
  };
  return {};
}

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

  saveOrder:function(products,order,callback) {
    var productsArray = order.products.split("|");
    var productDetails = 
	  productsArray.map(function(x){
	    var pair=x.split("&");
	    var name_short = pair[0];
	    var detail = searchJSONArray(products,'name_short',name_short);
	    var quantity = parseInt(pair[1]);
	    var unitprice = detail.price;
	    var subtotal = quantity * unitprice;
	    return {
	      name:detail.name,
	      quantity:quantity,
	      unitprice:unitprice,
	      subtotal:subtotal
	    };
	  });

    
    var saved = new Order({
      email:order.email,
      name:{
	first:order.firstname,
	last:order.lastname
      },
      address:{
	addr:order.addr,
	city:order.city,
	state:order.state,
	country:order.country,
	zipcode:order.zipcode
      }
    });
  },
  
  closeDB: function() {
    mongoose.disconnect();
  }
};


