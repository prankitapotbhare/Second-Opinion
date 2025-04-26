/**
 * Middleware to check if the user has the required role
 * @param {Array} roles - Array of allowed roles
 */
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You do not have permission to access this resource'
      });
    }

    next();
  };
};