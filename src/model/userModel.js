const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  role: String,
  code: Number,
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [roleSchema],
  refreshToken: String,
  create_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
