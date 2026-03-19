// controllers/profileController.js

const db = require("../config/db");

// Lấy thông tin profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Cập nhật thông tin profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    await db.query(
      "UPDATE users SET name = $1, phone = $2, address = $3 WHERE id = $4",
      [name, phone, address, userId]
    );

    const updatedResult = await db.query(
      "SELECT id, name, email, phone, address, role FROM users WHERE id = $1",
      [userId]
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedResult.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};