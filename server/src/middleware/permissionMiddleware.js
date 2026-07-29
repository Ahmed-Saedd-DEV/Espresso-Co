function permit(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const normalizedUserRole = String(req.user.role || "").toUpperCase();
    const normalizedRoles = roles.map((role) => String(role).toUpperCase());

    if (!normalizedRoles.includes(normalizedUserRole)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}

module.exports = permit;
