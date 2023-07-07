const { Op } = require("sequelize");
const { Post, Profile, Tag, User } = require("../models/index");
//helper
const formatPublished = require("../helpers/formatPublished");
const profile = require("../models/profile");
class Controller {
  static redirectToLogin(req, res) {
    res.redirect("/login");
  }
  static renderHome(req, res) {
    const UserId = req.session.userId;
    let { searchKey } = req.query;
    let condition = {};
    if (searchKey) {
      condition.name = {
        [Op.iLike]: `%${searchKey}%`,
      };
    }

    let options = {
      include: {
        model: User,
        required: true,
        include: {
          model: Profile,
          required: true,
          where: condition,
        },
      },
      order: [["like", "DESC"]],
    };

    Post.findAll(options)
      .then((posts) => {
        res.render("home", { posts, formatPublished, UserId });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static renderUserProfile(req, res) {
    const UserId = req.session.userId;
    Profile.findOne({
      where: { UserId: UserId },
      include: {
        model: User,
        include: Post,
      },
    })
      .then((profile) => {
        profile === null
          ? res.render("banned")
          : res.render("profileById", { profile, formatPublished });
        // console.log(profile);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static renderPostForm(req, res) {
    Tag.findAll()
      .then((tags) => {
        res.render("addPost", { tags });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleAddPost(req, res) {
    const UserId = req.session.userId;
    const { title, content, imageUrl, TagId } = req.body;

    Post.create({ title, content, imageUrl, TagId: TagId, UserId: UserId })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        console.log(req.body);
        console.log(err);
        res.send(err);
      });
  }
  static renderTagsForm(req, res) {
    const { errormsg } = req.query;
    let errorMessage = errormsg && errormsg.split(",");
    res.render("addTags", { errorMessage });
  }
  static handleAddTag(req, res) {
    const { name } = req.body;

    Tag.create({ name })
      .then(() => {
        res.redirect("/addPost");
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((el) => {
            return el.message;
          });
          //   res.send(errors);
          res.redirect(`/addTags?errormsg=${errors}`);
        } else {
          console.log(err);
          res.send(err);
        }
      });
  }
  static renderProfile(req, res) {
    const { id } = req.params;
    Profile.findByPk(id, {
      include: {
        model: User,
        include: Post,
      },
    })
      .then((profile) => {
        // res.send(profile);
        // console.log(profile);
        res.render("profile", { profile, formatPublished });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static renderEditProfile(req, res) {
    const { id } = req.params;
    Profile.findByPk(id)
      .then((profile) => {
        // res.send(profile);
        // console.log(profile);
        res.render("editProfile", { profile });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static handleEditProfile(req, res) {
    const { id } = req.params;
    const { name, picture, bio } = req.body;
    Profile.update({ name, picture, bio }, { where: { id } })
      .then(() => {
        res.redirect(`/user/profile/${id}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static addLike(req, res) {
    const { id } = req.params;
    Post.increment({ like: 10 }, { where: { id } })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static deletePost(req, res) {
    const { id } = req.params;
    Post.destroy({ where: { id: id } })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}
module.exports = Controller;
