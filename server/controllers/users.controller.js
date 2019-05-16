const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const UserModel = require('../models/user.model');
const { merge } = require('lodash');
const { aggregate } = require('./aggregations/aggregate');

module.exports = {

  getAll(req, res, next) {
    const aggregation = aggregate('users', req.query, req.user);
    aggregation.unshift({ $project: { email: true, password: true, role: true, created: true } });

    return UserModel.aggregate(aggregation)
      .then((users, err) => err ? next(err) : res.status(200).json(users))
      .catch(err => next(err));
  },
  getById(req, res, next) {
    const id = req.params.id;
    const user = req.user;

    // users are accessable by admins only
    if (id !== user.sub && user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Only Admin can do this request' });
    }

    return UserModel.findById(id).select('-hash')
      .then((user, err) => err ? next(err) : res.status(200).json(user))
      .catch(err => next(err));
  },
  exists(id) {
    return UserModel.findById(id)
      .then((user, err) => !!user)
      .catch(err => res.status(500).json(err));
  },
  update(req, res, next) {
    return UserModel.findByIdAndUpdate(req.params.id, req.body)
      .then((user, err) => err ? next(err) : res.status(200).json(user))
      .catch(err => next(err));
  },
  remove(req, res, next) {
    return UserModel.findByIdAndRemove(req.params.id)
      .then((user, err) => err ? next(err) : res.sendStatus(200))
      .catch(err => next(err));
  },
  removeAll(req, res, next) {
    /** @TODO on remove owner: also remove his/her restaurants? **/
    const cond = process.env.NODE_ENV === 'development' ? { email : { $ne: "su@ufb.fr" } } : {};
    return UserModel.deleteMany(cond)
    .then((users, err) => err ? next(err) : res.sendStatus(200))
    .catch(err => next(err));
  },
  removeTestUser(req, res, next) {
    return UserModel.find({ email: 'testuser@ed.cba' }).remove()
      .then((user, err) => err ? next(err) : res.sendStatus(200))
      .catch(err => next(err));
  },
  async register(req, res, next) {
    const { email, password } = req.body;
    if (!email || ! password) return res.status(400).json({ message: 'E-mail and password are required fields. '});

    if (await UserModel.findOne({ email })) {
      return res.status(403).json({ message: 'This e-mail is already registered.' });//400?
    }

    const user = new UserModel({ email, password });

    user.hash = bcrypt.hashSync(req.body.password, 10);
    if (process.env.NODE_ENV === 'development' && req.body.role) {
      user.role = req.body.role;
    } else {
      user.role = req.body.owner ? 'owner' : 'user';
    }
    user.created = new Date();

    user.save((err, user) => {
      if (err) next(err);
      else {
        const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret);
        return res.status(201).json({ token });
      }
    });
  },
  async authenticate(req, res, next) {
    try {
      const auth = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');

      const email = auth[0];
      const password = auth[1];

      const user = await UserModel.findOne({ email });

      if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret);

        return res.json({ token });
      }

      return next('Username or password is incorrect.');

    } catch(e) {
      return next('Username and password are required.');
    }
  },
  seed(req, res, next) {

    const users = req.body.map(u => merge({
        hash: bcrypt.hashSync(u.password, 10),
        created: u.created || (new Date())
      }, u))

    UserModel.create(users, err => {
      if (err) next(err);
      else return res.status(201).json(users);
    });
  },
};
