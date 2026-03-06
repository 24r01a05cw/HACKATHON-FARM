const jwt = require("jsonwebtoken");

function extractToken(req) {
  const header = req.header("Authorization") || "";
  const trimmed = header.trim();
  if (!trimmed) return null;
  if (/^Bearer\s+/i.test(trimmed)) return trimmed.replace(/^Bearer\s+/i, "").trim();
  return trimmed;
}

module.exports = function authMiddleware(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key");
    // decoded should contain: { sub, role }
    req.user = {
      id: decoded.sub || decoded.id,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};