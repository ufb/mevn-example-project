const express = require('express');
const auth = require('./middleware/mw.auth');
const roles = require('./authorizations');
const router = express.Router();

const RestaurantsController = require('./controllers/restaurants.controller');
const UsersController = require('./controllers/users.controller');
const ReviewsController = require('./controllers/reviews.controller');

// admin: seed db
if (process.env.NODE_ENV === 'development') {
  router.post('/api/restaurants/seed', auth(roles.restaurants.seed), RestaurantsController.seed);
  router.post('/api/restaurants/:sid/reviews/seed', auth(roles.restaurants.reviews.seed), ReviewsController.seed);
  router.post('/api/users/seed', auth(roles.users.seed), UsersController.seed);
}

// restaurants
router.get('/api/restaurants', auth(roles.restaurants.read), RestaurantsController.getAll);
router.post('/api/restaurants', auth(roles.restaurants.create), RestaurantsController.add);
router.delete('/api/restaurants', auth(roles.restaurants.delete), RestaurantsController.removeAll);
router.delete('/api/restaurants/:id', auth(roles.restaurants.delete), RestaurantsController.remove);
router.put('/api/restaurants/:id', auth(roles.restaurants.update), RestaurantsController.update);
// reviews
router.get('/api/restaurants/:id/reviews', auth(roles.restaurants.reviews.read), ReviewsController.getAll);
router.post('/api/restaurants/:id/reviews', auth(roles.restaurants.reviews.create), ReviewsController.add);
router.delete('/api/restaurants/:sid/reviews', auth(roles.restaurants.reviews.delete), ReviewsController.removeAll);
router.delete('/api/restaurants/:sid/reviews/:vid', auth(roles.restaurants.reviews.delete), ReviewsController.remove);
router.put('/api/restaurants/:sid/reviews/:vid', auth(roles.restaurants.reviews.update), ReviewsController.update);
// replies
router.post('/api/restaurants/:sid/reviews/:vid/reply', auth(roles.restaurants.reviews.reply.create), ReviewsController.addReply);
// users
router.get('/api/users', auth(roles.users.read), UsersController.getAll);
router.delete('/api/users', auth(roles.users.delete), UsersController.removeAll);
router.get('/api/users/self', UsersController.authenticate);
router.get('/api/users/:id', auth(roles.users.read), UsersController.getById);
router.post('/api/users', UsersController.register);
// test route
router.delete('/api/users/testuser', auth(roles.users.delete), UsersController.removeTestUser);
// users
router.delete('/api/users/:id', auth(roles.users.delete), UsersController.remove);
router.put('/api/users/:id', auth(roles.users.update), UsersController.update);

router.get('/:anything', (req, res) => res.render('index.html'));

module.exports = router;
