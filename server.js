require("dotenv").config();
const express = require("express");
const User = require("./users.js");
const Exercise = require("./exercises.js");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  const { username } = req.body;
  try {
    const existingUser = await User.find({ username: username });
    if (existingUser.length !== 0) {
      return res.status(400).json("User already exist");
    }
    const newUser = new User({
      username,
    });
    newUser.save().then((result) => {
      res.status(200).json(result);
    });
  } catch {
    return res.status(500).send({ error: "Problems with our server" });
  }
});

app.get("/api/exercise/users", (req, res) => {
  User.find({})
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "server error" });
    });
});

app.post("/api/exercise/add", async (req, res) => {
  const { userId, description, duration } = req.body;
  let date;
  if (req.body.date === "") {
    date = undefined;
  } else {
    date = new Date(req.body.date);
  }

  try {
    const existingUser = await User.findById(userId);
    const exercise = new Exercise({
      userId,
      username: existingUser.username,
      description,
      duration,
      date,
    });
    const savedExercise = await exercise.save();
    const newExercise = {
      _id: savedExercise.userId,
      username: savedExercise.username,
      date: savedExercise.date.toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description,
    };
    return res.status(200).json(newExercise);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ ERROR: err.message });
    }
    return res.status(500).json({ ERROR: "Server problem" });
  }
});

app.get("/api/exercise/log", (req, res) => {});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/***********************************************************************************/

// You can make a GET request to /api/exercise/log with a parameter of userId=_id to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises added. Each log item has the description, duration, and date properties.

// A request to a user's log (/api/exercise/log) returns an object with a count property representing the number of exercises returned.

// You can add from, to and limit parameters to a /api/exercise/log request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
