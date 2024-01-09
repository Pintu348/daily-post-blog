const router = require("express").Router();
const { body } = require("express-validator");

const userController = require("../controller/user");

const postController = require("../controller/Post");

const isAuth = require("../middleware/is-auth");

// show pages to the user

router.get("/", userController.getHome);

router.get("/profile", isAuth.notLoggedIn, userController.getProfile);

router.get("/posts", isAuth.notLoggedIn, userController.getPosts);

router.get(
  "/changepassword",
  isAuth.notLoggedIn,
  userController.getChangePassword
);

router.post(
  "/changepassword",
  [
    body("newPassword")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password should atleast of 8 character and not too long!"),
  ],
  isAuth.notLoggedIn,
  userController.postChangePassword
);

router.get("/addPost", isAuth.notLoggedIn, userController.getAddPost);

router.post(
  "/addPost",
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("title should be atleast 5 character!")
      .isLength({ max: 255 })
      .withMessage("Title you have entered is too long!"),

    body("descrip")
      .trim()
      .isLength({ min: 10 })
      .withMessage("description should be atleat 10 character!"),
  ],
  isAuth.notLoggedIn,
  userController.postAddPost
);

router.post("/deletePost", isAuth.notLoggedIn, userController.postDeletePost);

router.get("/editPost/:postId", isAuth.notLoggedIn, userController.getEditPost);

router.post(
  "/editPost",
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("title should be atleast 5 character!")
      .isLength({ max: 255 })
      .withMessage("Title you have entered is too long!"),

    body("descrip")
      .trim()
      .isLength({ min: 10 })
      .withMessage("description should be atleat 10 character!"),
  ],
  isAuth.notLoggedIn,
  userController.postEditPost
);

router.get("/postDetails/:id", userController.getDetailsPost);

router.get("/favoritePost", isAuth.notLoggedIn, postController.getFavoritePost);

router.post(
  "/favoritePost",
  isAuth.notLoggedIn,
  postController.postFavoritePost
);

router.post(
  "/deleteFavoritePost",
  isAuth.notLoggedIn,
  postController.postDeleteFavoritePost
);

router.post("/likedPost", isAuth.notLoggedIn, postController.postLikedPost);

router.post("/likesBy", isAuth.notLoggedIn, postController.getLikedBy);

module.exports = router;
