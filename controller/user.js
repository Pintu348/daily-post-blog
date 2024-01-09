const { validationResult, header } = require("express-validator/check");

const User = require("../model/user");

const Post = require("../model/post");

// const Likes = require("../model/likescount");

const io = require("../socket");

const FavoritePost = require("../model/favoritepost");

const LikedPost = require("../model/likedpost");

const fileHelper = require("../util/file");

const bcrypt = require("bcrypt");

// const transporter = require("../util/sendgrid");

exports.getHome = async (req, res, next) => {
  // const isLoggedIn=JSON.parse(req.get("cookie").split("=")[2])
  // console.log("i am session value",req.session);
  // let successMessage = req.flash("favoritePostDeleteSuccess")[0]||req.flash("favoritePostAddSuccess")[0];
  const errorMessage = req.flash("noUserError");
  req.session.detailsURL = req.url;
  const tempArr = [];
  const post = await Post.findAll();
  // const likes = await Likes.findAll();
  if (req.session.isLoggedIn) {
    try {
      const favoritePost = await FavoritePost.findAll({
        where: { UserId: req.session.user.dataValues.id },
      });
      const likedPost = await LikedPost.findAll({
        where: { UserId: req.session.user.dataValues.id },
      });
      for (let i = 0; i < post.length; i++) {
        for (let j = 0; j < likedPost.length; j++) {
          if (post[i].id == likedPost[j].PostId) {
            post[i].liked = true;
          }
        }
        for (let j = 0; j < favoritePost.length; j++) {
          if (post[i].id == favoritePost[j].PostId) {
            post[i].bookmark = true;
            // tempArr.push(post[i]);
          }
        }
        if (post[i].bookmark && post[i].liked) {
          tempArr.push(post[i]);
        } else if (!post[i].bookmark && post[i].liked) {
          tempArr.push(post[i]);
        } else if (post[i].bookmark && !post[i].liked) {
          tempArr.push(post[i]);
        } else {
          tempArr.push(post[i]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  let postForUser;
  if (tempArr.length > 0) {
    postForUser = tempArr;
  } else {
    postForUser = post;
  }

  return res.render("pages/home", {
    pageTitle: "home page",
    Post: postForUser,
    // Likes:likes,
    path1: "pages/home",
    successMessage: null,
    errorMessage: errorMessage,
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.getProfile = async (req, res, next) => {
  // const isLoggedIn=JSON.parse(req.get("cookie").split("=")[2])
  // console.log("i am session value",req.session);
  return res.render("pages/profile", {
    pageTitle: "profile page",
    path4: "pages/profile",
    successMessage: req.flash("changePasswordSuccess")[0],
    username: req.session.user.dataValues.name,
    useremail: req.session.user.dataValues.email,
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.getPosts = async (req, res, next) => {
  const successMessage =
    req.flash("addPostSuccess")[0] ||
    req.flash("editPostSuccess")[0] ||
    req.flash("deletePostSuccess")[0];
  // const isLoggedIn=JSON.parse(req.get("cookie").split("=")[2])
  // console.log("i am session value",req.session);
  const userId = req.session.user.dataValues.id;
  const post = await Post.findAll({ where: { UserId: userId } });
  req.session.detailsURL = req.url;
  // console.log("i am",post[0].dataValues);
  // console.log("i am",post.length);
  return res.render("pages/posts", {
    pageTitle: "Posts Page",
    path5: "pages/admin",
    Post: post,
    errorMessage: req.flash("deletionError")[0],
    successMessage: successMessage,
    username: req.session.user.dataValues.name,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getChangePassword = async (req, res, next) => {
  return res.render("pages/changepassword", {
    pageTitle: "changepassword Page",
    path4: "pages/profile",
    errorMessage: req.flash("changePasswordError")[0],
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postChangePassword = async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log("validate",errors.array())
      req.flash("changePasswordError", errors.array()[0].msg);
      return res.redirect("/changepassword");
    }

    if (newPassword != confirmPassword) {
      req.flash(
        "changePasswordError",
        "password and confirm password doesn't match"
      );
      return res.redirect("/changepassword");
    }
    const email = req.session.user.dataValues.email;
    const user = await User.findOne({ where: { email: email } });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    req.flash("changePasswordSuccess", "Your password updated successfully!");
    return res.redirect("/profile");
  } catch (err) {
    console.log(err);
  }
};

exports.getAddPost = async (req, res, next) => {
  const errorMessage = req.flash("addPostError");
  return res.render("pages/add-post", {
    pageTitle: "Add post Page",
    errorMessage: errorMessage,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddPost = async (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.descrip;
  try {
    if (!image) {
      req.flash("addPostError", "attached file is not an image");
      return res.redirect("/addPost");
    }
    const errors = validationResult(req);
    const errorMessage = [];
    if (!errors.isEmpty()) {
      // console.log("validate",errors.array().length)
      for (let i = 0; i < errors.array().length; i++) {
        errorMessage.push(errors.array()[i].msg);
      }
      req.flash("addPostError", errorMessage);
      return res.redirect("/addPost");
    }
    const imageUrl = image.path.replace("\\", "/");
    const user = await User.findOne({
      where: { email: req.session.user.dataValues.email },
    });
    await user.createPost({
      Title: title,
      imageUrl: imageUrl,
      description: description,
    });
    // io.getIO().emit("postCreated","i am here");
    req.flash("addPostSuccess", "Your post created successfully!");
    return res.redirect("/posts");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeletePost = async (req, res, next) => {
  const postId = req.body.postId;
  const post = await Post.findOne({
    where: { id: postId, UserId: req.session.user.dataValues.id },
  });
  try {
    if (!post) {
      req.flash("deletionError", "You are not authorized to delete!");
      return res.redirect("/posts");
    }
    fileHelper.deleteFile(post.imageUrl);
    await post.destroy();
    req.flash("deletePostSuccess", "Your Post Deleted Sucessfully!");
    return res.redirect("/posts");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditPost = async (req, res, next) => {
  const postId = req.params.postId;
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/posts");
  }
  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.redirect("/posts");
  }
  return res.render("pages/add-post", {
    pageTitle: "Update post Page",
    errorMessage: req.flash("editPostError"),
    Post: post,
    editing: editMode,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postEditPost = async (req, res, next) => {
  const postId = req.body.postId;
  const title = req.body.title;
  const image = req.file;
  const description = req.body.descrip;
  try {
    const errors = validationResult(req);
    const errorMessage = [];
    if (!errors.isEmpty()) {
      // console.log("validate",errors.array().length)
      for (let i = 0; i < errors.array().length; i++) {
        errorMessage.push(errors.array()[i].msg);
      }
      req.flash("editPostError", errorMessage);
      return res.redirect(`/editPost/${postId}?edit=true`);
    }
    const post = await Post.findOne({
      where: { id: postId, UserId: req.session.user.dataValues.id },
    });
    if (!post) {
      req.flash("editPostError", "You are not authorized to Update!");
      return res.redirect(`/editPost/${postId}?edit=true`);
    }
    let imageUrl = post.imageUrl;
    if (image) {
      fileHelper.deleteFile(post.imageUrl);
      imageUrl = image.path.replace("\\", "/");
    }
    await post.update({
      Title: title,
      imageUrl: imageUrl,
      description: description,
    });
    req.flash("editPostSuccess", "Your post updated successfully!");
    return res.redirect("/posts");
  } catch (err) {
    console.log(err);
  }
};

exports.getDetailsPost = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findByPk(postId);
  return res.render("pages/post-details", {
    pageTitle: "Details post Page",
    Post: post,
    url: req.session.detailsURL,
    isAuthenticated: req.session.isLoggedIn,
  });
};
