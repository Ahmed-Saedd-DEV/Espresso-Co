const authServices = require("../services/authServices");
const { parseCookies } = require("../utils/authUtils");

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.registerUser = async (req, res) => {
  try {
    const user = await authServices.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const result = await authServices.verifyEmail(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const result = await authServices.resendVerificationEmail(req.body.email);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const result = await authServices.forgotPassword(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    const result = await authServices.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await authServices.loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

    res.json({ message: result.message, token: result.token });
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
    res.cookie(
      "refreshToken",
      refreshTokenData.refreshToken,
      refreshTokenCookieOptions,
    );
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
    const { refreshToken } = parseCookies(req);

    // Best-effort: if a refresh token exists, attempt to revoke it server-side.
    // Do not expose failure details to the client; always clear the cookie and return success.
    if (refreshToken) {
      try {
        await authServices.logoutUser(refreshToken);
      } catch (err) {
        // swallow errors to avoid leaking token state
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/auth",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    // On unexpected errors, still clear the cookie and respond with success
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/auth",
    });
    res.status(200).json({ message: "Logout successful" });
  }
};
