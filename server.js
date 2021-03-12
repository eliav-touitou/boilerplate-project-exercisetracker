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
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "server error" });
    });
});

app.post("/api/exercise/add", async (req, res) => {
  const { userId, description, duration } = req.body;
  const date = req.body.date === "" ? new Date() : new Date(req.body.date);
  const userLog = await User.findById(userId).then((user) => {
    return user.log;
  });

  userLog.unshift({
    description: description,
    duration: Number(duration),
    date: date.toDateString(),
  });
  User.findByIdAndUpdate(userId, { log: userLog }, { new: true })
    .then((updatedUser) => {
      const usersTask = {
        username: updatedUser.username,
        _id: updatedUser.id,
        date: updatedUser.log[0].date,
        duration: updatedUser.log[0].duration,
        description: updatedUser.log[0].description,
      };
      res.json(usersTask);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ ERROR: err.message });
      }
      return res.status(500).json({ ERROR: "Server problem" });
    });
});

app.get("/api/exercise/log", (req, res) => {
  const { userId, from, to, limit } = req.query;
  User.findById(userId, (error, result) => {
    if (!error) {
      let user = result;

      if (from || to) {
        let fromDate = new Date(0);
        let toDate = new Date();

        if (from) {
          fromDate = new Date(from);
        }

        if (to) {
          toDate = new Date(to);
        }

        fromDate = fromDate.getTime();
        toDate = toDate.getTime();

        user.log = user.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime();

          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }

      if (limit) {
        user.log = user.log.slice(0, limit);
      }

      res.json({
        _id: user.id,
        username: user.username,
        count: user.log.length,
        log: user.log,
      });
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
