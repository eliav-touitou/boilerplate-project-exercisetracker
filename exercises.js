require("dotenv").config();
const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGO_URI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const exerciseSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
  },
  {
    versionKey: false,
  }
);
const Exercise = mongoose.model("exercises", exerciseSchema);
module.exports = Exercise;
///////////////////////////////////////////////
// You can POST to /api/exercise/add with form data userId=_id, description,
//duration, and optionally date. If no date is supplied, the current date will be used.
//The response returned will be the user object with the exercise fields added.
