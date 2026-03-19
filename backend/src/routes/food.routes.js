const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// public
router.get("/", foodController.getFoods);
router.get("/:id", foodController.getFoodById);

// admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  foodController.createFood
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  foodController.updateFood
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), foodController.deleteFood);

module.exports = router;