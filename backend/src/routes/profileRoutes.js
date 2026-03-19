// routes/profileRoutes.js

const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

// ==============================
// GET PROFILE
// ==============================

router.get(
  "/profile",
  auth,
  profileController.getProfile
);

// ==============================
// UPDATE PROFILE
// ==============================

router.put(
  "/profile",
  auth,
  profileController.updateProfile
);

module.exports = router;