const express = require("express");
const router = express.Router();
const Controller = require("../controllers/historyController");
const { authentication, isAdminOrAuthor, isAdmin } = require("../middlewares/auth");

router.use(authentication);

router.get("/", Controller.getAllHistory);

module.exports = router;
