const userService = require("../services/admin.user.service");

/**
 * Lấy danh sách user
 */
exports.getUsers = async (req, res) => {
  try {

    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};


/**
 * Cập nhật role user
 */
exports.updateUserRole = async (req, res) => {
  try {

    const result = await userService.updateUserRole(
      req.params.id,
      req.body.role
    );

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};


/**
 * Khóa / mở user
 */
exports.updateUserStatus = async (req, res) => {
  try {

    const result = await userService.updateUserStatus(
      req.params.id,
      req.body.is_active
    );

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};


/**
 * Xóa user
 */
exports.deleteUser = async (req, res) => {
  try {

    const result = await userService.deleteUser(
      req.params.id
    );

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};