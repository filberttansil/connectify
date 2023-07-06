const { Op } = require("sequelize");
const { Post, Profile, Tag, User } = require("../models/index");
//helper
const formatPublished = require("../helpers/formatPublished");
class Controller {
  static renderHome(req, res) {
    let { searchKey } = req.query;
    // searchKey ? (searchKey = searchKey) : "";
    let condition = {};
    // console.log(searchKey);
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
      //   where: {},
    };

    // console.log(options.include);
    Post.findAll(options)
      .then((posts) => {
        res.render("home", { posts, formatPublished });
        // res.send(posts);
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
    const { title, content, imageUrl, TagId, UserId } = req.body;

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
}
module.exports = Controller;
