const router = require("express").Router();
const { body } = require("express-validator");

const authController = require("../controller/auth");

const isAuth = require("../middleware/is-auth");

router.get("/login", isAuth.isLoggedIn, authController.getLogin);

router.get("/signup", isAuth.isLoggedIn, authController.getSignup);

// posting data to the backend
router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage("You name should be atleast 5 character and not too long!"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter correct Email!")
      .normalizeEmail()
      .isLength({ max: 100 })
      .withMessage("Email is not supported!"),

    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password should atleast of 8 character and not too long!"),
  ],
  authController.postSignup
);

// user login or authentication

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter correct Email!")
      .normalizeEmail()
      .isLength({ max: 100 })
      .withMessage("Email is not supported!"),
  ],
  isAuth.loginFailedAttempt,
  isAuth.isLoggedIn,
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get(
  "/resetpassword",
  isAuth.isLoggedIn,
  authController.getResetPassword
);

router.post(
  "/resetpassword",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter correct Email!")
      .normalizeEmail()
      .isLength({ max: 100 })
      .withMessage("Email is not supported!"),
  ],
  isAuth.resetPasswordFailedAttempt,
  authController.postResetPassword
);

module.exports = router;
