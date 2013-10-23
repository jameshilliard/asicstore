var db = require('./database');
var config = require('./config.json');

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/account/login');
};

var account = require('./routes/account');
var store = require('./routes/store');
var product = require('./routes/product');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');

module.exports = function(app,passport) {
  app.get('/',function(req,res) {
    req.session.last = "main";
    db.getProducts(function(err,products) {
      if(err) console.log(err);
      res.render('main',{'products':products});
    });
  });

  app.get('/order',function(req,res) {
    res.render('order');
  });

  // app.get('/account/register',account.register);
  // app.get('/account/home',ensureAuth,account.home);
  // app.post('/account/login', function(req,res,next) {
  //   passport.authenticate('local',function(err,user,info){
  //     if(err){return next(err);}
      
  //     if(!user) {return res.send({"status":"fail"});};
      
  //     req.logIn(user,function(err){
  // 	if(err){return next(err);}
  // 	return res.redirect('/');
  //     });
  //   })(req,res,next);
  // });

  // app.post('/cart/add/:id',cart.addProduct);
  // app.post('/cart/rem/:id',cart.remProduct);

  app.get('/cart/list', cart.list);
  
};
