const db = require("../config/db");

/**
 * Lấy danh sách users
 */
exports.getUsers = async () => {

  const result = await db.query(
    `SELECT id,name,email,phone,address,role,is_active,created_at
     FROM users
     WHERE role != 'admin'
     ORDER BY created_at DESC`
  );

  return result.rows;
};


/**
 * Cập nhật role user
 */
exports.updateUserRole = async (id, role) => {

  const exist = await db.query(
    "SELECT id FROM users WHERE id=$1",
    [id]
  );

  if (exist.rows.length === 0) {
    throw new Error("User not found");
  }

  await db.query(
    "UPDATE users SET role=$1 WHERE id=$2",
    [role, id]
  );

  return { message: "User role updated successfully" };
};


/**
 * Khóa / mở user
 */
exports.updateUserStatus = async (id, is_active) => {

  const exist = await db.query(
    "SELECT id FROM users WHERE id=$1",
    [id]
  );

  if (exist.rows.length === 0) {
    throw new Error("User not found");
  }

  await db.query(
    "UPDATE users SET is_active=$1 WHERE id=$2",
    [is_active, id]
  );

  return { message: "User status updated" };
};


/**
 * Xóa user
 */
exports.deleteUser = async (id) => {

  const exist = await db.query(
    "SELECT id FROM users WHERE id=$1 AND role != 'admin'",
    [id]
  );

  if (exist.rows.length === 0) {
    throw new Error("User not found");
  }

  await db.query(
    "DELETE FROM users WHERE id=$1",
    [id]
  );

  return { message: "User deleted successfully" };
};