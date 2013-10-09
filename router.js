var db = require('./database');
var config = require('./config.json');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/account/login');
};

module.exports = function(app,passport) {
  app.get('/',function(req,res) {
    db.getProducts(function(err,products) {
      if(err) console.log(err);
      res.write(JSON.stringify(products));
      res.end();
    });
  });
};
