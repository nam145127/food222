const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// public
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  categoryController.createCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  categoryController.updateCategory
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), categoryController.deleteCategory);

module.exports = router;