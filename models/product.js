var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: { type: String, required: true },

  shipping: {
    weight: { type: Number, required: false },
    dimensions: {
      width: { type: Number, required: false },
      height: { type: Number, required: false },
      depth: { type: Number, required: false }
    }
  },

  price: { type: Number, required: true },

  details: {
    description: { type: String, required: false }
  }
});

// Export product model
module.exports = mongoose.model('Product', ProductSchema);
