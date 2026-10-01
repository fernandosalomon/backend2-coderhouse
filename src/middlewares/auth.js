export const auth = (...permisos) => {
  return (req, res, next) => {
    permisos = permisos.map((p) => p.toUpperCase());

    if (permisos.includes("PUBLIC")) {
      return next();
    }

    if (!permisos.includes(req.user.role.toUpperCase())) {
      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para realizar esta acción",
      });
    }
    next();
  };
};
