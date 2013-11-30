var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  hash: {type:String,required:true},
  name : { 
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  
  address : {       
    addr1: {type:String, required:true},
    addr2: {type:String, required:false},
    city: {type:String, required:true},
    state: {type:String, required:true},
    country: {type:String, required:true},
    zipcode: {type:String, required:true}
  },
  
  email: { type: String, required: true},
  
  total: {type:Number,required: true},
  
  items: [{
    name:{type:String,required:true},
    quantity:{type:Number,required: true},
    unitprice:{type:Number,required: true},
    subtotal:{type:Number,required: true}
  }]
});

module.exports = mongoose.model('Order', OrderSchema);
