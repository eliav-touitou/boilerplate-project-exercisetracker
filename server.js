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

app.get("/api/exercise/log", (request, response) => {
  User.findById(request.query.userId, (error, result) => {
    if (!error) {
      let user = result;

      if (request.query.from || request.query.to) {
        let fromDate = new Date(0);
        let toDate = new Date();

        if (request.query.from) {
          fromDate = new Date(request.query.from);
        }

        if (request.query.to) {
          toDate = new Date(request.query.to);
        }

        fromDate = fromDate.getTime();
        toDate = toDate.getTime();

        user.log = user.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime();

          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }

      if (request.query.limit) {
        user.log = user.log.slice(0, request.query.limit);
      }

      // user1 = user.toJSON();
      // user["count"] = result.log.length;
      response.json({
        _id: user.id,
        username: user.username,
        count: user.length,
        log: user.log,
      });
    }
  });
});
// app.get("/api/exercise/log", async (req, res) => {
//   const { userId, from, to, limit } = req.query;

//   const userLog = await User.findById(userId).then((user) => {
//     return user.log;
//   });
//   ///////////////////////////////////////

//   if (from) {
//     const fromDate = new Date(from);
//     userLog = userLog.filter((exe) => new Date(exe.date) > fromDate);
//   }

//   if (to) {
//     const toDate = new Date(to);
//     userLog = userLog.filter((exe) => new Date(exe.date) < toDate);
//   }

//   if (limit) {
//     userLog = userLog.slice(0, limit);
//   }

//   ///////////////////////////////////////

//   User.findById(userId).then((user) => {
//     res.json({
//       _id: user.id,
//       username: user.username,
//       count: userLog.length,
//       log: userLog,
//     });
//   });
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/***********************************************************************************/

// You can make a GET request to /api/exercise/log with a parameter of userId=_id to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises added. Each log item has the description, duration, and date properties.

// A request to a user's log (/api/exercise/log) returns an object with a count property representing the number of exercises returned.

// You can add from, to and limit parameters to a /api/exercise/log request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
