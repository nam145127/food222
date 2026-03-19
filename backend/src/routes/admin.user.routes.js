const express = require("express");
const router = express.Router();

const userController = require("../controllers/admin.user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.use(authMiddleware, roleMiddleware("admin"));

router.get("/", userController.getUsers);

router.patch("/:id/role", userController.updateUserRole);

router.patch("/:id/status", userController.updateUserStatus);

router.delete("/:id", userController.deleteUser);

module.exports = router;