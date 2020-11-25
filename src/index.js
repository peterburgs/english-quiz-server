const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// MongoDB Connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// Get userCredential model (without re-create new model)
require("./models/UserCredential");
const authRoutes = require("./routes/authRoutes");

//Define app
const app = express();

// Test connection status
mongoose.connection.on("connected", () => {
  console.log("*LOG: Connected to MongoDB successfully!");
});
mongoose.connection.on("error", () => {
  console.log("*LOG: Fail to connect to MongoDB!");
});

// Body Parser
app.use(bodyParser.json());
// User Routers
app.use(authRoutes);

// Export
module.exports = app;
