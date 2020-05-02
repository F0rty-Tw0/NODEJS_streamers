const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

//User Schema setup
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Makes sure to encrypt the passwords
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);