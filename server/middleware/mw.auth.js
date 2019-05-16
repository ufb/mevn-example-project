const jwt = require('express-jwt');
const { secret } = require('../config');
const { exists } = require('../controllers/users.controller');

async function isRevoked(req, payload, done) {

    const userExists = await exists(payload.sub);

    if (!userExists) {
      return done('Cannot find user.', true);
    }
    done();
};

module.exports = function(roles = []) {

  return [
    // AUTHENTICATION
    // JWT token authentication
    // token.sub ~> req.user.id
    // token.role ~> req.user.role
    // revoke JWT if user doesn't exist in DB
    jwt({ secret, isRevoked }),

    // AUTHORIZATION
    // check passed-in roles against req.user.role
    // reject request if user not authorized
    (req, res, next) => {
      if (!req.user.role || (roles.length && !roles.includes(req.user.role))) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      next();
    }
  ];
}
