var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  name : { 
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  
  address : {       
    addr: {type:String, required:false},
    city: {type:String, required:false},
    state: {type:String, required:false},
    country: {type:String, required:false},
    zipcode: {type:String, required:false}
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
