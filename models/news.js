"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      News.belongsTo(models.User, { foreignKey: "AuthorId" });
      News.belongsTo(models.Category, { foreignKey: "CategoryId" });
      News.hasMany(models.History, { foreignKey: "NewsId" });
      News.belongsToMany(models.Customer, { through: models.Like });
    }
  }
  News.init(
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Title is required",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "archived"),
        defaultValue: "active",
      },
      content: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Content is required",
          },
        },
      },
      imgUrl: DataTypes.STRING,
      AuthorId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "News",
    }
  );
  return News;
};
