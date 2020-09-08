const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    //the id we get from auntheneticating with google
    type: String,
    required: true,
  },
  displayName: {
    //The first and last Name together which google gives you
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
