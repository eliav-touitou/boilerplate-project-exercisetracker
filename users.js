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
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // description: {
    //   type: String,
    // },
    // duration: {
    //   type: Number,
    // },
    // date: {
    //   type: String,
    // },
    log: [{}],
    count: Number,
  },
  {
    versionKey: false,
  }
);
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("users", userSchema);

///////////////////////////////////////////////
