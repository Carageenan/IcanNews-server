const express = require("express");
const router = express.Router();
const Controller = require("../controllers/likesController");
const { authentication, isAdmin } = require("../middlewares/auth");

router.use(authentication);

router.post("/:NewsId", Controller.createLikes);
router.get("/", Controller.showAllFavorites);

module.exports = router;
