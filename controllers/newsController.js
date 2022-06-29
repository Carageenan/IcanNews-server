const { News, User, Category, History, Like, Customer } = require("../models/index");
const { Op } = require("sequelize");

class Controller {
  static async addNews(req, res, next) {
    try {
      const { title, content, imgUrl, CategoryId } = req.body;
      console.log(req.body);
      const createdAt = new Date();
      const updatedAt = new Date();
      let dataCreateNews = await News.create({
        title,
        content,
        imgUrl,
        AuthorId: req.identify.id,
        CategoryId,
        createdAt,
        updatedAt,
      });
      const NewsId = dataCreateNews.id;
      const name = dataCreateNews.title;
      const description = `New News with id ${NewsId} created`;
      const updatedBy = req.identify.role;
      let dataHistory = await History.create({
        NewsId,
        name,
        description,
        updatedBy,
        createdAt,
        updatedAt,
      });
      res.status(201).json({
        message: "Success add News",
        dataCreateNews,
      });
    } catch (err) {
      next(err);
    }
  }
  static async showAllNews(req, res, next) {
    try {
      let dataNews = await News.findAll({
        order: [["id", "ASC"]],
      });
      res.status(200).json({
        message: "Success show News",
        dataNews,
      });
    } catch (err) {
      next(err);
    }
  }
  static async showAllNewsCust(req, res, next) {
    try {
      const { page, size, filter, search } = req.query;
      console.log(filter, search);
      let option;
      let set = 0;
      if (page > 1) {
        set = +size * (+page - 1);
      }

      if (!page) {
        option = {
          include: {
            model: Customer,
          },
          where: { status: "active" },
          order: [["id", "ASC"]],
        };
      } else {
        if (!filter && !search) {
          option = {
            include: {
              model: Customer,
            },
            where: { status: "active" },
            limit: +size,
            offset: +set,
            order: [["id", "ASC"]],
          };
        } else {
          if (!filter) {
            option = {
              include: {
                model: Customer,
              },
              where: { title: { [Op.iLike]: `%${search}%` }, status: "active" },
              limit: +size,
              offset: +set,
              order: [["id", "ASC"]],
            };
          } else if (!search) {
            option = {
              include: {
                model: Customer,
              },
              where: { CategoryId: filter, status: "active" },
              limit: +size,
              offset: +set,
              order: [["id", "ASC"]],
            };
          } else {
            option = {
              include: {
                model: Customer,
              },
              where: { title: { [Op.iLike]: `%${search}%` }, CategoryId: filter, status: "active" },
              limit: +size,
              offset: +set,
              order: [["id", "ASC"]],
            };
          }
        }
      }
      const dataNews = await News.findAll(option);

      res.status(200).json({
        message: "Success show News",
        dataNews,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async showNewsByPk(req, res, next) {
    try {
      const newsId = +req.params.NewsId;
      let dataNews = await News.findByPk(newsId, {
        include: {
          model: Like,
        },
      });
      if (!dataNews) {
        throw {
          code: 404,
          name: "Not Found",
          message: "Data not found",
        };
      }
      res.status(200).json({
        message: "Success show news by Id",
        dataNews,
      });
    } catch (err) {
      next(err);
    }
  }
  static async updateNewsById(req, res, next) {
    try {
      const newsId = +req.params.NewsId;
      const { title, content, imgUrl, CategoryId } = req.body;
      const updatedAt = new Date();
      const dataNews = await News.findByPk(newsId);
      if (!dataNews) {
        throw {
          code: 404,
          name: "Not Found",
          message: "Data not found",
        };
      }

      const updateNews = await News.update(
        {
          title,
          content,
          imgUrl,
          CategoryId,
          updatedAt,
        },
        {
          where: {
            id: newsId,
          },
        }
      );

      const newData = await News.findByPk(newsId);

      const name = newData.title;
      const description = `News with id ${newsId} updated`;
      const updatedBy = req.identify.role;
      const createdAt = new Date();
      let dataHistory = await History.create({
        NewsId: newsId,
        name,
        description,
        updatedBy,
        createdAt,
        updatedAt,
      });
      res.status(200).json({
        message: "Success update News byId",
        data: newData,
      });
    } catch (err) {
      next(err);
    }
  }
  static async changeStatus(req, res, next) {
    try {
      console.log(req.params.NewsId, req.body);
      const { status } = req.body;
      const newsId = +req.params.NewsId;
      const dataNews = await News.findByPk(newsId);
      const updatedAt = new Date();
      if (!dataNews) {
        throw {
          code: 404,
          name: "Not Found",
          message: "Data not found",
        };
      }
      const updateNewsStat = await News.update(
        {
          status,
          updatedAt,
        },
        {
          where: {
            id: newsId,
          },
        }
      );
      const newData = await News.findByPk(newsId);

      const name = newData.title;
      const description = `News with id ${newsId} status has been updated from ${dataNews.status} into ${newData.status}`;
      const updatedBy = req.identify.role;
      const createdAt = new Date();
      let dataHistory = await History.create({
        NewsId: newsId,
        name,
        description,
        updatedBy,
        createdAt,
        updatedAt,
      });
      res.status(200).json({
        message: "Succes update news status",
        data: newData,
      });
    } catch (err) {
      next(err);
    }
  }
  static async deleteNewsById(req, res, next) {
    try {
      const newsId = +req.params.NewsId;
      const dataNews = await News.findByPk(newsId);
      if (!dataNews) {
        throw {
          code: 404,
          name: "Not Found",
          message: "Data not found",
        };
      }
      console.log("ketemu");
      const deleteNews = await News.destroy({
        where: {
          id: newsId,
        },
      });
      res.status(200).json({
        message: "Success delete News",
        data: dataNews,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = Controller;
