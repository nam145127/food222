const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post(
"/",
auth,
orderController.createOrder
);

router.get(
"/my-orders",
auth,
orderController.getMyOrders
);

router.get(
"/admin",
auth,
role("admin"),
orderController.getAllOrders
)


router.get(
"/:code",
auth,
orderController.getOrderDetail
);

router.patch(
"/:code/status",
auth,
role("admin"),
orderController.updateOrderStatus
);


module.exports = router;