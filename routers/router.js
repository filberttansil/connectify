const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

//home
router.get("/home", Controller.renderHome);
//render add post form
router.get("/addPost", Controller.renderPostForm);
//add post to database
router.post("/addPost", Controller.handleAddPost);
//render add Tags form
router.get("/addTags", Controller.renderTagsForm);
//handle add Tag
router.post("/addTags", Controller.handleAddTag);
module.exports = router;
