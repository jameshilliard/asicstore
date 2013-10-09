var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');


var UserSchema = new Schema({
    btc : {type: String, required:true, unique:true},

    address : {       
        address1: {type:String, required:false},
        address2: {type:String, required:false},
        town: {type:String, required:false},
        province: {type:String, required:false},
        country: {type:String, required:false},
        zipcode: {type:String, required:false}
    },
    
    contactNum: {type: Number, required: false},
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    hash: { type: String, required: true }
  });


UserSchema
.virtual('password')
.get(function () {
  return this._password;
})
.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});


UserSchema.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
});


UserSchema.static('authenticate', function(btc, password, callback) {
  this.findOne({ btc : btc }, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      user.verifyPassword(password, function(err, passwordCorrect) {
        if (err) { return callback(err); }
        if (!passwordCorrect) { return callback(null, false); }
        return callback(null, user);
      });
    });
});

module.exports = mongoose.model('User', UserSchema);
