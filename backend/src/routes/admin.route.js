const express = require("express")
const router = express.Router()

const adminController = require("../controllers/admin.controller")

const auth = require("../middleware/authMiddleware")
const role = require("../middleware/roleMiddleware")

router.get(
"/dashboard",
auth,
role("admin"),
adminController.dashboard
)

module.exports = router