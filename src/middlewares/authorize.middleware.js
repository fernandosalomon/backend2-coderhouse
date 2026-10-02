export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    allowedRoles = allowedRoles.map((p) => p.toUpperCase());

    if (allowedRoles.includes("PUBLIC")) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role.toUpperCase())) {
      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para realizar esta acción",
      });
    }
    next();
  };
};
