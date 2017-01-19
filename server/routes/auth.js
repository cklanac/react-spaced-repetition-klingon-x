import 'babel-polyfill';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/user';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../config';

const router = express.Router();

mongoose.Promise = global.Promise;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
  // const user = {googleId: profile.id,accessToken: accessToken,displayName: profile.name};
  User.findOneAndUpdate({ googleId: profile.id },
    { $set: { name: profile.name, accessToken: accessToken } },
    { upsert: true, 'new': true })
    .then((user) => {
      done(null, user);
    }).catch(() => {
      console.log('catch error')
    });
}));

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function (req, res) {
    res.cookie('accessToken', req.user.accessToken, { expires: 0, httpOnly: false });
    res.redirect('/#/quiz');
  });

router.get('/logout', function (req, res) {
  req.logout();
  // res.clearCookie('accessToken');
  // console.log('cookie', req.cookies.accessToken);
  // res.redirect(`https://accounts.google.com/o/oauth2/revoke?token=${req.cookies.accessToken}`);
});

module.exports = router;
