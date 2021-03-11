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

app.post("/api/exercise/add", (req, res) => {});

app.get("/api/exercise/log", (req, res) => {});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/***********************************************************************************/
// You should provide your own project, not the example URL.

// You can POST to /api/exercise/new-user with form data username to create a new user. The returned response will be an object with username and _id properties.

// You can make a GET request to api/exercise/users to get an array of all users. Each element in the array is an object containing a user's username and _id.

// You can POST to /api/exercise/add with form data userId=_id, description, duration, and optionally date. If no date is supplied, the current date will be used. The response returned will be the user object with the exercise fields added.

// You can make a GET request to /api/exercise/log with a parameter of userId=_id to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises added. Each log item has the description, duration, and date properties.

// A request to a user's log (/api/exercise/log) returns an object with a count property representing the number of exercises returned.

// You can add from, to and limit parameters to a /api/exercise/log request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
