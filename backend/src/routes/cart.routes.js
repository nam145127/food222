const express = require("express")
const router = express.Router()

const cartController = require("../controllers/cart.controller")

const authMiddleware = require("../middleware/authMiddleware")

router.get("/", authMiddleware, cartController.getCart)

router.post("/add", authMiddleware, cartController.addToCart)

router.put("/:id", authMiddleware, cartController.updateCart)

router.delete("/:id", authMiddleware, cartController.deleteCart)

module.exports = router