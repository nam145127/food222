const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ==============================
// CREATE REVIEW
// ==============================

router.post(
"/",
auth,
reviewController.createReview
);

// ==============================
// GET REVIEWS BY FOOD
// ==============================

router.get(
"/food/:foodId",
reviewController.getFoodReviews
);

// ==============================
// GET FOOD RATING
// ==============================

router.get(
"/rating/:foodId",
reviewController.getFoodRating
);

// ==============================
// CHECK CAN REVIEW
// ==============================

router.get(
"/can-review/:foodId",
auth,
reviewController.canReview
);

// ==============================
// GET MY REVIEWS
// ==============================

router.get(
"/my",
auth,
reviewController.getMyReviews
);

// ==============================
// UPDATE REVIEW
// ==============================

router.put(
"/:id",
auth,
reviewController.updateReview
);

// ==============================
// DELETE REVIEW
// ==============================

router.delete(
"/:id",
auth,
reviewController.deleteReview
);

// ==============================
// ADMIN GET ALL REVIEWS
// ==============================

router.get(
"/",
auth,
role("admin"),
reviewController.getAllReviews
);

// ==============================
// ADMIN DELETE REVIEW
// ==============================

router.delete(
"/admin/:id",
auth,
role("admin"),
reviewController.adminDeleteReview
);

module.exports = router;