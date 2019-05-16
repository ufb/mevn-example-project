const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ReviewSchema = new Schema({
  user: { type: ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  created: { type: Date, required: true },
  restaurant: { type: ObjectId, required: true },
  comment: { type: String, required: false, minLength: 1, maxlength: 500 },
  reply: { type: String, required: false, minLength: 1, maxlength: 500 }
});

module.exports = ReviewSchema;
