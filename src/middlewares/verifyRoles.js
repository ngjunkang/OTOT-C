const verifyRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.roles) {
      return res.status(401).json({
        status: "error",
        message: "not authenticated",
      });
    }
    const allowedRolesArr = [...allowedRoles];
    const isAllowed = req.roles.some((r) => allowedRolesArr.includes(r));
    if (!isAllowed) {
      return res.status(403).json({
        status: "error",
        message: "not authorized",
      });
    }
    next();
  };

module.exports = verifyRoles;
