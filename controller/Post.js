const User = require("../model/user");

const Post = require("../model/post");

const FavoritePost = require("../model/favoritepost");

const LikedPost = require("../model/likedpost");

const Likes = require("../model/likescount");

const io = require("../socket");

exports.getFavoritePost = async (req, res, next) => {
  const arrayOfFavorite = [];
  try {
    const favoritePost = await FavoritePost.findAll({
      where: { UserId: req.session.user.dataValues.id },
    });
    for (let i = 0; i < favoritePost.length; i++) {
      arrayOfFavorite.push(
        await Post.findOne({ where: { id: favoritePost[i].PostId } })
      );
    }
  } catch (err) {
    console.log(err);
  }
  const successMessage = req.flash("deletefavoritePostSuccess")[0];
  const errorMessage = req.flash("deletefavoritePostError")[0];
  req.session.detailsURL = req.url;
  return res.render("pages/favorite-post", {
    pageTitle: "favorite post Page",
    path6: "pages/favorite-post",
    favoritePost: arrayOfFavorite,
    successMessage: successMessage,
    errorMessage: errorMessage,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postFavoritePost = async (req, res, next) => {
  const postId = req.body.id;
  const user = await User.findOne({
    where: { id: req.session.user.dataValues.id },
  });
  try {
    if (!user) {
      req.flash("noUserError", "Not Authenticated");
      return res.redirect("/");
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      console.log("No post with that id found while adding to favorite");
      return res.redirect("/");
    }
    const favoritePost = await FavoritePost.findOne({
      where: { PostId: postId, UserId: user.id },
    });
    if (!favoritePost) {
      await user.createFavoritePost({
        PostId: postId,
      });
      // req.flash("favoritePostAddSuccess","Added to favorite post!");
      return res.status(201).json({attribute:"btn btn-dark btn-sm",title:"remove from favorite"});
    } else {
      await favoritePost.destroy();
      // req.flash("favoritePostDeleteSuccess","Removed from favorite post!");
      return res.status(201).json({attribute:"btn btn-outline-dark btn-sm",title:"add to favorite"});
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteFavoritePost = async (req, res, next) => {
  const postId = req.body.id;
  const user = await User.findOne({
    where: { id: req.session.user.dataValues.id },
  });

  const favoritePost = await FavoritePost.findOne({
    where: { PostId: postId, UserId: user.id },
  });
  if (!favoritePost) {
    req.flash("deletefavoritePostError", "No Post to delete!");
    return res.redirect("/favoritePost");
  }
  await favoritePost.destroy();
  req.flash("deletefavoritePostSuccess", "Removed Successfully!");
  return res.redirect("/favoritePost");
};

exports.postLikedPost = async (req, res, next) => {
  const postId = req.body.postId;
  const user = await User.findOne({
    where: { id: req.session.user.dataValues.id },
  });
  const post = await Post.findOne({ where: { id: postId } });
  try {
    if (!post) {
      console.log("no post found for this id");
      return res.redirect("/");
    }
    if (!user) {
      console.log("no user located to like post");
      return res.redirect("/");
    }
    const likedPost = await LikedPost.findOne({
      where: { PostId: postId, UserId: user.id },
    });
    const likes = await Likes.findOne({ where: { PostId: postId } });
    if (!likedPost) {
      await user.createLikedPost({
        PostId: postId,
      });
      if (!likes) {
        await Likes.create({
          count: 1,
          PostId: postId,
        });
        io.getIO().emit("postLiked", {
          likes: 1,
          id:postId
        });
        return res.status(201).json({attribute:"btn btn-danger btn-sm",likesCount:1})
      } else {
        likes.count = likes.count + 1;
        await likes.save();
        io.getIO().emit("postLiked", {
          likes: likes.count,
          id:postId
        });
        return res.status(201).json({attribute:"btn btn-danger btn-sm",likesCount:likes.count})
      }
    } else {
      likes.count = likes.count - 1;
      await likes.save();
      await likedPost.destroy();
      io.getIO().emit("postLiked", {
        likes: likes.count,
        id:postId
      });
      return res.status(201).json({attribute:"btn btn-outline-danger btn-sm",likesCount:likes.count})
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getLikedBy = async (req, res, next) => {
  const postId = req.body.id;
  const likedPost = await LikedPost.findAll({ where: { PostId: postId } });
  const likedPostBy = [];
  for (let i = 0; i < likedPost.length; i++) {
    const user = await User.findOne({
      where: { id: likedPost[i].dataValues.UserId },
    });
    likedPostBy.push(user.dataValues.name);
  }
  return res.render("pages/postlikes", {
    pageTitle: "likes post Page",
    LikedBy: likedPostBy,
    isAuthenticated: req.session.isLoggedIn,
  });
};
