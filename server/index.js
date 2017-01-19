import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { PORT, DATABASE_URL } from '../config';

mongoose.Promise = global.Promise;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));
app.use(bodyParser.json());

const auth = require('./routes/auth');
app.use('/auth', auth);

const api = require('./routes/api');
app.use('/api', api);

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

