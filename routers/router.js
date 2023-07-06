const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/home", Controller.renderHome);
router.get("/addPost", Controller.addPost);

module.exports = router;
