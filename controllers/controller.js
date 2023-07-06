const { Op } = require("sequelize");
const { Post, Profile, Tag, User } = require("../models/index");
//helper
const formatPublished = require("../helpers/formatPublished");
class Controller {
  static renderHome(req, res) {
    let users;
    Post.findAll({
      include: {
        model: User,
        include: Profile,
      },
    })
      .then((posts) => {
        res.render("home", { posts, formatPublished });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static addPost(req, res) {
    Tag.findAll()
      .then((tags) => {
        res.render("addPost", { tags });
      })
      .catch((err) => {
        res.send(err);
      });
  }
}
module.exports = Controller;
