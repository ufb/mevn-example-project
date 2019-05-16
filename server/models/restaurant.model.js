const mongoose = require('mongoose');
const ReviewSchema = require('./review.schema');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RestaurantSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 50 },
  address: { type: String, required: true, minLength: 2, maxLength: 150 },
  owner: { type: ObjectId, required: true },
  ratingsSum: { type: Number, required: false, default: 0 },
  ratingsCount: { type: Number, required: false, default: 0 },
  avgRating: { type: Number, required: false, default: 0 },
  created: { type: Date, required: true },
  reviews: [ReviewSchema]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
