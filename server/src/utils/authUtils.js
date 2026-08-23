const buildAccessTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

const parseCookies = (req) => {
  const cookieHeader = req?.headers?.cookie || "";

  const cookies = {};

  // Split on ';' to get individual cookie strings
  for (const cookie of cookieHeader.split(";")) {
    const raw = cookie.trim();
    if (!raw) continue;

    // Split only on the first '=' to preserve '=' in the value (eg. base64 padding)
    const idx = raw.indexOf("=");
    let name;
    let value;

    if (idx === -1) {
      // Flag-style cookie with no value
      name = raw;
      value = "";
    } else {
      name = raw.slice(0, idx).trim();
      value = raw.slice(idx + 1).trim();
    }

    if (!name) continue;

    // Remove wrapping quotes if present
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // Try to decode URI component, but fall back to the raw value on error
    try {
      value = decodeURIComponent(value);
    } catch (e) {
      // ignore and keep raw value
    }

    cookies[name] = value;
  }

  return cookies;
};

module.exports = {
  buildAccessTokenPayload,
  parseCookies,
};
