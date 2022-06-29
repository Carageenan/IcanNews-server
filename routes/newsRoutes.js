const express = require("express");
const router = express.Router();
const Controller = require("../controllers/newsController");
const { authentication, isAdminOrAuthor, isAdmin } = require("../middlewares/auth");

router.get("/cust", Controller.showAllNewsCust);
router.get("/:NewsId", Controller.showNewsByPk);

router.use(authentication);

router.post("/", Controller.addNews);
router.get("/", Controller.showAllNews);
router.put("/:NewsId", isAdminOrAuthor, Controller.updateNewsById);
router.patch("/:NewsId", isAdmin, Controller.changeStatus);
router.delete("/:NewsId", isAdminOrAuthor, Controller.deleteNewsById);

module.exports = router;
