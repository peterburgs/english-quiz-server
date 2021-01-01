const express = require("express");
const { route } = require("./authRoutes");

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});
router.post("/", requireAdmin, (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

module.exports = router;
