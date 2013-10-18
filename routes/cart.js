var db = require('../database');

module.exports = {
  
  list: function(req,res) {
    if(req.session.cart) {
      res.jsonp({'data':req.session.cart});
    } else {
      res.jsonp({});
    }
  }

};
