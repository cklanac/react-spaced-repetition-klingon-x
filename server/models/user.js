const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  name: {
    type: Object,
    required: true
  },
  googleId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    require: true,
  },

});

const User = mongoose.model('User', UserSchema);

module.exports = User;