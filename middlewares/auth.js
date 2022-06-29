const { readTokenFromPayload } = require("../helpers/jwt");
const { User, News, Customer } = require("../models/index");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = readTokenFromPayload(access_token);
    let dataUser;
    if (payload.role !== "Customer") {
      dataUser = await User.findByPk(payload.id);
    } else {
      dataUser = await Customer.findByPk(payload.id);
    }

    if (!dataUser) {
      throw {
        code: 401,
        name: "Unauthorize",
        message: "Authentication error",
      };
    }
    req.identify = {
      id: dataUser.id,
      role: dataUser.role,
    };
    next();
  } catch (err) {
    next(err);
  }
};

const isAdminOrAuthor = async (req, res, next) => {
  try {
    if (req.identify.role === "Admin") next();
    else {
      const dataNews = await News.findByPk(req.params.NewsId);
      if (!dataNews) {
        throw {
          code: 404,
          name: "Not Found",
          message: "Data not found",
        };
      }
      if (dataNews.AuthorId !== req.identify.id) {
        throw {
          code: 403,
          name: "Forbidden",
          message: "Forbidden access",
        };
      }
      next();
    }
  } catch (err) {
    next(err);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.identify.role !== "Admin") {
      throw {
        code: 403,
        name: "Forbidden",
        message: "Forbidden access",
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authentication,
  isAdminOrAuthor,
  isAdmin,
};
