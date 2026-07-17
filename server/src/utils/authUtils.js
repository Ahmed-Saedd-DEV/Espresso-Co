const cookie = require("cookie");

const buildAccessTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

const parseCookies = (req) => {
  const cookieHeader = req?.headers?.cookie || "";
  return cookie.parseCookie(cookieHeader);
};

module.exports = {
  buildAccessTokenPayload,
  parseCookies,
};
