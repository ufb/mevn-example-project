const RestaurantModel = require('../models/restaurant.model');
const { merge } = require('lodash');
const { aggregate } = require('./aggregations/aggregate');

module.exports = {

  getAll(req, res, next) {
    const query = req.query;
    const user = req.user;

    return RestaurantModel.aggregate(aggregate('restaurants', query, user))
      .then((restaurants, err) => err ? next(err) : res.status(200).json(restaurants))
      .catch(err => next(err));
  },
  async add(req, res, next) {
    const name = req.body.name;

    if (await RestaurantModel.findOne({ name })) {
      return res.status(403).json({ message: 'A restaurant with this name already exists.' });//400?
    }

    const restaurant = merge({ owner: req.user.sub, created: (new Date()) }, req.body);
    delete restaurant.ratingsSum;
    delete restaurant.ratingsCount;
    delete restaurant.avgRating;

    (new RestaurantModel(restaurant)).save(err => {
      if (err) next(err);
      else return res.status(201).json(restaurant);
    });
  },
  seed(req, res, next) {
    const restaurants = req.body.map(r => merge({ owner: req.user.sub, created: (new Date()) }, r))

    RestaurantModel.create(restaurants, err => {
      if (err) next(err);
      else return res.status(201).json(restaurants);
    });
  },
  remove(req, res, next) {
    return RestaurantModel.findByIdAndRemove(req.params.id)
    .then((restaurant, err) => err ? next(err) : res.sendStatus(200))
    .catch(err => next(err));
  },
  removeAll(req, res, next) {
    return RestaurantModel.deleteMany({})
    .then((restaurant, err) => err ? next(err) : res.sendStatus(200))
    .catch(err => next(err));
  },
  update(req, res, next) {
    return RestaurantModel.findByIdAndUpdate(req.params.id, req.body)
      .then((restaurant, err) => err ? next(err) : res.status(200).json(restaurant))
      .catch(err => next(err));
  }
};
