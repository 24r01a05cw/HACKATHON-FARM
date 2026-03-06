module.exports = function requireRole(...allowedRoles) {
  return function requireRoleMiddleware(req, res, next) {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    return next();
  };
};

