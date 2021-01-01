// Get models
require("./models/UserCredential");
require("./models/User");
require("./models/Level");
require("./models/Topic");
require("./models/Progress");
require("./models/Pool");
require("./models/Question");
//
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Middlewares
const requireAuth = require("./middlewares/requireAuth");

// MongoDB Connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// Test connection status
mongoose.connection.on("connected", () => {
  console.log("*LOG: Connected to MongoDB successfully!");
});
mongoose.connection.on("error", () => {
  console.log("*LOG: Fail to connect to MongoDB!");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const levelRoutes = require("./routes/levelRoutes");
const topicRoutes = require("./routes/topicRoutes");
const progressRoutes = require("./routes/progressRoutes");
const poolRoutes = require("./routes/poolRoutes");
const questionRoutes = require("./routes/questionRoutes");
const demoRoutes = require("./routes/demoRoutes");

//Define app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Body Parser
app.use(bodyParser.json());

// Handle header
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PUT, DELETE, PATCH, GET"
    );
    return res.status(200).json({});
  }
  next();
});

// Use Routers
app.use(authRoutes);
app.use("/users", userRoutes);
app.use("/levels", levelRoutes);
app.use("/topics", topicRoutes);
app.use("/progresses", progressRoutes);
app.use("/pools", poolRoutes);
app.use("/questions", questionRoutes);
app.use("/demo", demoRoutes);

// GET
app.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.email}`,
  });
});

//Handle 404 error
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Handle other error codes
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      code: "404",
    },
  });
});

// Export
module.exports = app;
