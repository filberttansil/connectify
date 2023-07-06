"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Tag);
      Post.belongsTo(models.User);
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title is required!",
          },
          notEmpty: {
            msg: "Title is required!",
          },
        },
      },
      content: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "imageUrl is required!",
          },
          notEmpty: {
            msg: "imageUrl is required!",
          },
        },
      },
      like: DataTypes.INTEGER,
      TagId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Tags",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  Post.beforeCreate((post) => {
    post.like = 0;
  });
  return Post;
};
