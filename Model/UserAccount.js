const mongoose = require('mongoose');

const UserAccount = mongoose.model('UserAccount', {
    email: { type: String },
    password: { type: String },
    verified: { type: Boolean },
});

module.exports = UserAccount