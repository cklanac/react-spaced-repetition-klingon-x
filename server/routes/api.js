import 'babel-polyfill';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import User from '../models/user';
import Question from '../models/question';

const router = express.Router();

mongoose.Promise = global.Promise;

passport.use(new BearerStrategy(
  (accessToken, done) => {
    User.findOne({ accessToken })
      .then((user) => {
        done(null, user, { scope: 'read' });
      }).catch((err) => {
        done(err, null);
      });
  },
));

// apply passport.authenticate() to all paths in this route
router.use(passport.authenticate('bearer', { session: false }));

// Get all the questions for this user
router.get('/questions', (req, res) => {
  Question.find({}).then(results => res.json(results));
});

// Get all the questions for this user
router.put('/questions', (req, res) => res.json({ message: 'update questions' }));


module.exports = router;
