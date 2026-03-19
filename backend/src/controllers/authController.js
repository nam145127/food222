const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.json({
      message: "User created",
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);

    res.json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const data = await authService.refreshToken(req.body.refreshToken);

    res.json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);

    res.json({
      message: "Logged out"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};