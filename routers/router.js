const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");


router.get("/register", UserController.registerForm);
router.post("/register", UserController.postRegisterForm);
router.get("/login", UserController.loginForm);
router.post("/login", UserController.postLogin);

router.use(function (req, res, next){
    console.log(req.session)
    if(!req.session.userId){
        const error = 'PLEASE LOGIN FIRST!' //kalau belum ada sesion kasi tau harus login 
        res.redirect('/login?error=$(error') //balikin ke home 
    }
    else{
        next()
    }
})

router.get("/home", Controller.renderHome);
router.get("/addPost", Controller.addPost);

module.exports = router;
