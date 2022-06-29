const { Like, News, Customer } = require("../models");
class Controller {
  static async createLikes(req, res, next) {
    try {
      const NewsId = req.params.NewsId;
      const createdAt = new Date();
      const updatedAt = new Date();

      const likes = await Like.create({
        CustomerId: req.identify.id,
        NewsId,
        createdAt,
        updatedAt,
      });
      res.status(201).json({ message: "Succes create favorites" });
    } catch (err) {
      next(err);
    }
  }
  static async showAllFavorites(req, res, next) {
    try {
      const favorites = await Like.findAll({
        include: [
          {
            model: News,
          },
          {
            model: Customer,
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where: {
          CustomerId: req.identify.id,
        },
      });
      res.status(200).json(favorites);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = Controller;
