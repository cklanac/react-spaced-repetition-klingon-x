import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import BearerStrategy from 'passport-http-bearer';
import User from './models/user';
import { PORT, DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config';
mongoose.Promise = global.Promise;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));
app.use(bodyParser.json());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
    const user = {
        googleId: profile.id,
        accessToken: accessToken,
        displayName: profile.name
    };
    // return done(null, user);
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    /* Don't do this, your token will never get updated
    User.findOne({ googleId: profile.id })
        .then((user) => {
            if (user) {
                done(null, user);
            } else {
                User.create({
                    accessToken,
                    googleId: profile.id,
                    name: profile.name,
                }).then((user) => {
                    return done(null, user);
                });
            }
        })*/

    User.findOneAndUpdate({ googleId: profile.id },
        { $set: { name: profile.name, accessToken: accessToken } },
        { upsert: true, 'new': true })
        .then((user) => {
            done(null, user);
        }).catch(() => {

        });

    // This might work
    // findOrCreate mongoose plugin
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     return done(err, user);
    // });
}));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        res.cookie('accessToken', req.user.accessToken, { expires: 0, httpOnly: false });
        res.redirect('/#/quiz');
    });

app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/home');
});


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

app.get('/api/questions', passport.authenticate('bearer', { session: false }),
    (req, res) => res.json([
        { question: 'a', answer: 'xxA', mValue: 1 },
        { question: 'b', answer: 'B', mValue: 1 },
        { question: 'c', answer: 'C', mValue: 1 },
        { question: 'd', answer: 'D', mValue: 1 },
    ]));

app.post('/users', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'No request body' });
    }
    let {name} = req.body;
    return User.create({ name })
        .then(user => {
            return res.location('/users/' + user._id).status(201).json({});
        })
        .catch(err => {
            return res.status(500).json({ message: 'Internal server error' })
        });
});

function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, err => {
            if (err) {
                return reject(err);
            }
            console.log(`Mongo is connected to ${DATABASE_URL}`);
            app.listen(PORT, () => {
                console.log(`Your app is listening on port ${PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer();
}

