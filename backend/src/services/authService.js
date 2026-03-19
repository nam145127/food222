const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async ({ name, email, password }) => {

  const existing = await pool.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name,email,password,is_active) VALUES ($1,$2,$3,$4) RETURNING id",
    [name, email, hashed, true]
  );

  return {
    id: result.rows[0].id,
    name,
    email,
    is_active: true
  };
};


// LOGIN
exports.login = async ({ email, password }) => {

  const rows = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (rows.rows.length === 0) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  const user = rows.rows[0];

  // check account active
  if (!user.is_active) {
    throw new Error("Tài khoản đã bị khóa 🚫");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Wrong password");
  }

  // ACCESS TOKEN
  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );

  // REFRESH TOKEN
  const refreshToken = jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );

  await pool.query(
    "INSERT INTO refresh_tokens (user_id,token) VALUES ($1,$2)",
    [user.id, refreshToken]
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    },
    accessToken,
    refreshToken
  };
};


// REFRESH TOKEN
exports.refreshToken = async (token) => {

  const rows = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token=$1",
    [token]
  );

  if (rows.rows.length === 0) {
    throw new Error("Invalid refresh token");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  const users = await pool.query(
    "SELECT id,name,role,is_active FROM users WHERE id=$1",
    [decoded.id]
  );

  if (users.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = users.rows[0];

  if (!user.is_active) {
    throw new Error("Account disabled");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );

  return { accessToken };
};


// LOGOUT
exports.logout = async (token) => {

  await pool.query(
    "DELETE FROM refresh_tokens WHERE token=$1",
    [token]
  );

  return { message: "Logged out successfully" };
};