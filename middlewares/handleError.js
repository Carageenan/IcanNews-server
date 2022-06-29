const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeValidationError":
      const msg = err.errors.map((el) => el.message);
      res.status(400).json({ message: msg });
      break;
    case "Unauthorized":
      res.status(err.code).json({ message: err.message });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.message });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: err.message });
      break;
    case "Not Found":
      res.status(err.code).json({ message: err.message });
      break;
    case "Forbidden":
      res.status(err.code).json({ message: err.message });
      break;
    case "Bad Request":
      res.status(err.code).json({ message: err.message });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errorHandler;
