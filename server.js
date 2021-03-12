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

app.post("/api/exercise/new-user", (req, res) => {
  const { username } = req.body;
  const user = new User({
    username: username,
  });
  user
    .save()
    .then((savedUser) => {
      res.json(savedUser);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/api/exercise/users", (req, res) => {
  User.find()
    .select({ _id: 1, username: 1 })
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "server error" });
    });
});

app.post("/api/exercise/add", (req, res) => {
  const { userId, description, duration } = req.body;
  const date = new Date(req.body.date) || new Date();

  User.findByIdAndUpdate(
    userId,
    {
      description: description,
      duration: Number(duration),
      date: date.toDateString(),
    },
    { new: true }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ ERROR: err.message });
      }
      return res.status(500).json({ ERROR: "Server problem" });
    });
  // }})
  // const exercise = new Exercise({
  //   userId,
  //   username: existingUser.username,
  //   description,
  //   duration,
  //   date,
  // });
  // const savedExercise = await exercise.save();
  // const newExercise = {
  //   username: savedExercise.username,
  //   description: savedExercise.description,
  //   duration: savedExercise.duration,
  //   _id: savedExercise.userId,
  //   date: savedExercise.date.toDateString(),
  // };
  // return res.status(200).json(newExercise);
  // } catch (err) {
  //   console.log(err);
  //   if (err.name === "ValidationError") {
  //     return res.status(400).json({ ERROR: err.message });
  //   }
  //   return res.status(500).json({ ERROR: "Server problem" });
  // }
});

app.get("/api/exercise/log", (req, res) => {});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/***********************************************************************************/

// You can make a GET request to /api/exercise/log with a parameter of userId=_id to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises added. Each log item has the description, duration, and date properties.

// A request to a user's log (/api/exercise/log) returns an object with a count property representing the number of exercises returned.

// You can add from, to and limit parameters to a /api/exercise/log request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
