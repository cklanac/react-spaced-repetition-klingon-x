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
    const user = {
      accessToken: accessToken,
      displayName: 'John Doe'
    };

    // User.findOne({ accessToken: accessToken })
    //     .then(user => {
    return done(null, user, { scope: 'read' });
    //     })

  }
));

router.get('/questions', passport.authenticate('bearer', { session: false }),
  (req, res) => res.json([
    { question: 'a', answer: 'A', mValue: 1 },
    { question: 'b', answer: 'B', mValue: 1 },
    { question: 'c', answer: 'C', mValue: 1 },
    { question: 'd', answer: 'D', mValue: 1 },
  ]));

router.get('/foo', (req, res) => res.json({ foo: "bar" }));


module.exports = router;
