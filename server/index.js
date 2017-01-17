import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './models/user';

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('../config');

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));
app.use(bodyParser.json());

app.get('/questions', (req, res) => res.json([
    { question: 'a', answer: 'A', mValue: 1 },
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
            console.dir(err, { colors: true })
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

