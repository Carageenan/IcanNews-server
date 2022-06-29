const {Category} = require('../models/index')

class Controller {
  static async ShowAllCategory(req, res, next) {
    try {
      const data = await Category.findAll()
      res.status(200).json({
        message: "Success show categories",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async ShowCategoryById(req, res, next) {
    const CategoryId = req.params.CategoryId
    const dataCategory = Category.findByPk(CategoryId)
    if(!dataCategory) {
      throw {
        code: 404,
        name: "Not Found",
        message: "Data not found",
      }
    }
    res.status(200).json({
      message:'Success show category by id',
      data: dataCategory
  })
  }
}

module.exports = Controller;
