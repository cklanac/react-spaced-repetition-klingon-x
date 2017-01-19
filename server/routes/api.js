import 'babel-polyfill';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import User from '../models/user';

const router = express.Router();

mongoose.Promise = global.Promise;

passport.use(new BearerStrategy(
  function (accessToken, done) {
    User.findOne({ accessToken: accessToken })
      .then(user => {
        done(null, user, { scope: 'read' });
      }).catch(err => {
        done(err, null);
      });
  }
));

router.get('/questions', passport.authenticate('bearer', { session: false }),
  (req, res) => res.json(req.user.questions));

module.exports = router;
