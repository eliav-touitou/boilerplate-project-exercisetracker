require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGO_URI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);
userSchema.plugin(uniqueValidator);
const User = mongoose.model("exercises", userSchema);
module.exports = User;
///////////////////////////////////////////////
