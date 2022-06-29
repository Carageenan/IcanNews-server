const { History } = require("../models/index");

class Controller {
  static async getAllHistory(req, res, next) {
    try {
      const dataHistory = await History.findAll();
      res.status(200).json({
        message: "Success show all history",
        data: dataHistory,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
