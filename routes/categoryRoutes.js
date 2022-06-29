const express = require("express");
const router = express.Router();
const Controller = require("../controllers/categoryController");
const { authentication, isAdmin } = require("../middlewares/auth");

router.get("/", Controller.ShowAllCategory);

router.use(authentication);

router.get("/:CategoryId", Controller.ShowCategoryById);

module.exports = router;
