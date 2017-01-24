import dotenv from 'dotenv';

dotenv.config({ silent: true });

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/spaced-repetition';
exports.PORT = process.env.PORT || 8080;

exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
