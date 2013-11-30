var db = require('./database');
var config = require('./config.json');

var Recaptcha = require('re-captcha');
var PUBLIC_KEY  = '6Ld_VukSAAAAAGmAxIKdshM9RXwuu00FcZoWH0ru';
var PRIVATE_KEY = '6Ld_VukSAAAAAAfceEXQxD4w0UveVEmOtoKWj42D';
var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);

var mailer = require('./mailer');

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/account/login');
};

var account = require('./routes/account');
var store = require('./routes/store');
var product = require('./routes/product');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');
var moment = require('moment');



module.exports = function(app,passport) {
  db.getProducts(function(err,products){
    if(err) {console.log("Can't get products");process.exit();};

    app.get('/',function(req,res) {
      res.render('example2',{'layout':'demo'});
    });

    app.get('/ie',function(req,res) {
      res.render('example',{'layout':'demo_ie'});
    });

    app.get('/demo',function(req,res) {
      res.render ('example',{'layout':'demo'});
    });



    app.get('/store',function(req,res) {
      res.render('main',{'products':products});
    });

    app.get('/placeorder',function(req,res) {
      res.render('place', {'products':products,'recaptcha_form': recaptcha.toHTML()});
    });

    app.post('/verify',function(req,res) {
      var data = {
	remoteip:  req.connection.remoteAddress,
	challenge: req.body.recaptcha_challenge_field,
	response:  req.body.recaptcha_response_field
      };
      recaptcha.verify(data, function(err) {
	if (err) {
	  res.send('false');
	} else {
	  res.send('true');
	}
      });
    });

    app.post('/placeorder',function(req,res) {
      var order = req.body;
      console.log(order);
      db.saveOrder(products,order,
		   function(error,saved){
		     res.send(saved.hash);
		   });
    });
    
    app.get('/order/:hash',function(req,res) {
      db.findOrder(req.param('hash'),function(err,order){
	console.log(order);
	res.render('order',{order:order});
      });
    });


    // app.post('/order', function(req, res) {
    //   var data = {
    // 	remoteip:  req.connection.remoteAddress,
    // 	challenge: req.body.recaptcha_challenge_field,
    // 	response:  req.body.recaptcha_response_field
    //   };

    //   recaptcha.verify(data, function(err) {
    // 	if (err) {
    // 	  // Redisplay the form.
    // 	  res.render('order', {
    //         recaptcha_form: recaptcha.toHTML(err)
    // 	  });
    // 	} else {
    // 	  res.send('Recaptcha response valid.');
    // 	}
    //   });
    // });

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

    // app.get('/cart/list', cart.list);
  });
};


