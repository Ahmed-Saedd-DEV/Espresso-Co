const authServices = require("../services/authServices");
const { parseCookies } = require("../utils/authUtils");

exports.registerUser = async (req, res) => {
  try {
    const user = await authServices.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await authServices.loginUser(req.body);
    res.setHeader("Set-Cookie", result.refreshTokenCookie);

    res.json({
      message: result.message,
      token: result.token,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const cookies = parseCookies(req);
    const refreshTokenValue = cookies.refreshToken;

    if (!refreshTokenValue) {
      return res.status(401).json({ error: "Refresh token not provided" });
    }

    const refreshTokenData = await authServices.refreshToken(refreshTokenValue);
    res.setHeader("Set-Cookie", refreshTokenData.refreshTokenCookie);
    res.json({ token: refreshTokenData.token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await authServices.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await authServices.logoutUser(userId);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  refreshToken: exports.refreshToken,
  getProfile: exports.getProfile,
  logoutUser: exports.logoutUser,
};
