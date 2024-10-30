const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Tạo User schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Thêm plugin Passport-Local Mongoose vào schema
UserSchema.plugin(passportLocalMongoose);

// Tạo model User
const User = mongoose.model('User', UserSchema);

module.exports = User;
