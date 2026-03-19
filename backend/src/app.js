const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/admin.user.routes");
const categoryRoutes = require("./routes/category.routes");
const foodRoutes = require("./routes/food.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const contactRoutes = require("./routes/contact.routes");
const profileRoutes = require("./routes/profileRoutes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.route");
const chatRoutes = require("./routes/chat.routes");





const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);



module.exports = app;