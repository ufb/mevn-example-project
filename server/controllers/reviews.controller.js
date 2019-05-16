const toObjectId = require('mongoose').Types.ObjectId;
const { merge } = require('lodash');
const RestaurantModel = require('../models/restaurant.model');

function _update(req, res, next, sid, updater) {
  return RestaurantModel.findByIdAndUpdate(sid)
    .then((restaurant, err) => {
      if (err) return next(err);
      restaurant = updater(restaurant);
      return restaurant.save()
        .then(() => res.status(200).json(restaurant))
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

module.exports = {

  getAll(req, res, next) {
    return RestaurantModel.findById(req.params.id)
      .then((restaurant, err) => err ? next(err) : res.status(200).json(restaurant))
      .catch(err => next(err));
  },
  add(req, res, next) {
    const id = req.params.id;
    const uid = req.user.sub;

    return _update(req, res, next, id, (restaurant) => {
      const uid = req.user.sub;

      if (restaurant.reviews.find(rev => rev.user && rev.user.toString() === uid)) {
        throw('You can only add one review per restaurant.');
      }
      const review = {
        user: toObjectId(uid),
        restaurant: toObjectId(id),
        created: new Date()
      };
      merge(review, req.body);

      delete review.reply;

      restaurant.ratingsCount++;
      restaurant.ratingsSum += review.rating;
      restaurant.avgRating = restaurant.ratingsSum / restaurant.ratingsCount;
      restaurant.reviews.push(review);

      return restaurant;
    });
  },
  seed(req, res, next) {
    const sid = req.params.sid;
    const uid = req.user.sub;

    let additionalRatingSum = 0;

    const reviews = req.body.map(r => {
      additionalRatingSum += r.rating;
      return merge({
        user: toObjectId(uid),
        restaurant: toObjectId(sid),
        created: r.created || new Date()
      }, r)
    });

    RestaurantModel.findByIdAndUpdate(sid)
      .then((restaurant, err) => {
        if (err) return next(err);
        restaurant.reviews = (restaurant.reviews || []).concat(reviews);
        restaurant.ratingsCount += reviews.length;
        restaurant.ratingsSum += additionalRatingSum;
        restaurant.avgRating = restaurant.ratingsSum / restaurant.ratingsCount;

        return restaurant.save()
          .then(() => res.status(200).json(reviews))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
  addReply(req, res, next) {
    return _update(req, res, next, req.params.sid, (restaurant) => {
      const reviews = restaurant.reviews;
      const review = reviews.find(rev => rev.id === req.params.vid);
      if (review.reply) throw('There is already a reply to this comment.');
      merge(review, req.body);
      return restaurant;
    });
  },
  remove(req, res, next) {
    return _update(req, res, next, req.params.sid, (restaurant) => {
      const reviews = restaurant.reviews;
      const i = reviews.findIndex(rev => rev.id === req.params.vid);

      if (i !== -1) {
        const review = reviews.splice(i, 1)[0];

        restaurant.ratingsCount--;
        restaurant.ratingsSum -= review.rating;
        restaurant.avgRating = restaurant.ratingsCount ? restaurant.ratingsSum / restaurant.ratingsCount : 0;
      }
      return restaurant;
    });
  },
  removeAll(req, res, next) {
    return _update(req, res, next, req.params.sid, (restaurant) => {
      restaurant.reviews = [];
      restaurant.ratingsCount = 0;
      restaurant.ratingsSum = 0;
      restaurant.avgRating = 0;
      return restaurant;
    });
  },
  update(req, res, next) {
    return _update(req, res, next, req.params.sid, (restaurant) => {
      const reviews = restaurant.reviews;
      const review = reviews.find(rev => rev.id === req.params.vid);

      if (review) {
        if (req.body.rating) {
          restaurant.ratingsSum -= review.rating;
          restaurant.ratingsSum += req.body.rating;
          restaurant.avgRating = restaurant.ratingsCount ? restaurant.ratingsSum / restaurant.ratingsCount : 0;
        }
        merge(review, req.body);
      }
      return restaurant;
    });
  }
};
