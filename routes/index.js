const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureGuest, (req, res) => {
  res.render("home");
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  let allUsers;
  const user = req.user;
  try {
    allUsers = await User.find({ _id: { $ne: user.id } })
      .select("displayName firstName lastName image")
      .lean();
  } catch (err) {
    return res.json("Server error");
  }

  res.render("dashboard", {
    layout: "chat",
    userImage: user.image,
    userName: user.displayName,
    userId: user.id,
    allUsers,
  });
});

module.exports = router;
