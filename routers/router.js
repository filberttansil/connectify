const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");

// router.get("/", UserController.redirectToLogin);
router.get("/register", UserController.registerForm);
router.post("/register", UserController.postRegisterForm);
router.get("/login", UserController.loginForm);
router.post("/login", UserController.postLogin);

router.use(function (req, res, next) {
  console.log(req.session);
  if (!req.session.userId) {
    const error = "PLEASE LOGIN FIRST!"; //kalau belum ada sesion kasi tau harus login
    res.redirect("/login?error=$(error"); //balikin ke home
  } else {
    next();
  }
});

const isAdmin = function (req, res, next) {
  console.log(req.session);
  if (req.session.role !== "Admin") {
    const error = "you have no access please log in as an Admin";

    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

router.get("/admin", isAdmin, UserController.admin);

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
//render Profile
router.get("/profile/:id", Controller.renderProfile);
router.get("/user/profile/:id", Controller.renderUserProfile);
//edit Profile
router.get("/profile/:id/edit", Controller.renderEditProfile);
router.post("/profile/:id/edit", Controller.handleEditProfile);
router.get("/logout", UserController.logout);
module.exports = router;
