const normalizeIp = (req, res, next) => {
  let ip = req.ip;

  // Convert IPv4-mapped IPv6 address to IPv4
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  req.clientIp = ip;

  next();
};

module.exports = normalizeIp;