const User = require("../model/user");

const { validationResult, header } = require("express-validator");

const io = require("../socket");

const bcrypt = require("bcrypt");

const transporter = require("../util/sendgrid");

exports.getLogin = async (req, res, next) => {
  let successMessage =
    req.flash("signupSuccess")[0] || req.flash("resetPasswordSuccess")[0];
  if (!req.session.loginFailedAttempt) {
    req.session.loginFailedAttempt = 0;
  }
  return res.render("auth/login", {
    pageTitle: "login page",
    path3: "auth/login",
    successMessage: successMessage,
    errorMessage: req.flash("loginError")[0],
  });
};

exports.getSignup = async (req, res, next) => {
  // console.log("i am flash",message)
  return res.render("auth/signup", {
    pageTitle: "signup page",
    path2: "auth/singup",
    errorMessage: req.flash("signupError"),
  });
};

exports.postSignup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // console.log(password,confirmPassword)
  try {
    const errors = validationResult(req);
    const errorMessage = [];
    if (!errors.isEmpty()) {
      // console.log("validate",errors.array())
      for (let i = 0; i < errors.array().length; i++) {
        errorMessage.push(errors.array()[i].msg);
      }
      req.flash("signupError", errorMessage);
      return res.redirect("/signup");
    }

    if (password != confirmPassword) {
      req.flash("signupError", "password and confirm password doesn't match");
      return res.redirect("/signup");
    }

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      req.flash(
        "signupError",
        "Email already exist please try with another one"
      );
      return res.redirect("/signup");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    try {
      // await transporter.sendMail({
      //     to:email,
      //     from:"pintu.pandit@escalon.services",
      //     subject:"Signup Succeeded!",
      //     html:`<h3>Thanks for choosing us!</h3>
      //     <h4>Your Email : ${email}</h4>
      //     <h4>Your Password : ${password}</h4>
      //     <h4>let's begin the new journey with us</h4>`
      // })
      req.flash("signupSuccess", "You signed up successfully!");
      return res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  const errorMessage = [];
  try {
    if (!errors.isEmpty()) {
      // console.log("validate",errors.array())
      for (let i = 0; i < errors.array().length; i++) {
        errorMessage.push(errors.array()[i].msg);
      }
      req.flash("loginError", errorMessage);
      req.session.loginFailedAttempt += 1;
      return res.redirect("/login");
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("loginError", "Invalid username or password");
      req.session.loginFailedAttempt += 1;
      return res.redirect("/login");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("loginError", "Invalid username or password");
      req.session.loginFailedAttempt += 1;
      return res.redirect("/login");
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.cookie.originalMaxAge = 3600 * 1000;
    req.session.loginFailedAttempt = 0;
    if (req.session.reqURL) {
      req.session.save((err) => {
        console.log("postlogin err ", err);
        return res.redirect(req.session.reqURL);
      });
    } else {
      req.session.save((err) => {
        console.log("post login err ", err);
        return res.redirect("/posts");
      });
    }
    // res.setHeader("set-cookie", "isLogged = true");
  } catch (err) {
    console.log("bcrypt compare err", err);
  }
};

exports.postLogout = async (req, res, next) => {
  // console.log("i am here")
  req.session.destroy((err) => {
    console.log("logout err ", err);
    return res.redirect("/login");
  });
  // res.setHeader("set-cookie", "isLogged = false");
};

exports.getResetPassword = async (req, res, next) => {
  if (!req.session.resetPasswordFailedAttempt) {
    req.session.resetPasswordFailedAttempt = 0;
  }
  return res.render("auth/reset", {
    pageTitle: "Reset Password Page",
    errorMessage: req.flash("resetPasswordError")[0],
  });
};

exports.postResetPassword = async (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);
  const errorMessage = [];
  try {
    if (!errors.isEmpty()) {
      // console.log("validate",errors.array())
      for (let i = 0; i < errors.array().length; i++) {
        errorMessage.push(errors.array()[i].msg);
      }
      req.flash("resetPasswordError", errorMessage);
      req.session.resetPasswordFailedAttempt += 1;
      return res.redirect("/resetPassword");
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("resetPasswordError", "No user found with this mail!");
      req.session.resetPasswordFailedAttempt += 1;
      return res.redirect("/resetPassword");
    }

    // program to generate random strings
    // declare all characters
    const characters =
      "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";

    function generateString(length) {
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    }

    const resetedpassword = generateString(10);
    try {
      //     await transporter.sendMail({
      //         to:email,
      //         from:"pintu.pandit@escalon.services",
      //         subject:"password resetted successfully!",
      //         html:`<h3>You new password is :- ${resetedpassword} </h3>`
      //     })
      console.log(resetedpassword);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(resetedpassword, salt);
      user.password = hashedPassword;
      await user.save();
      req.flash(
        "resetPasswordSuccess",
        "your password resetted successfully please check your mail!"
      );
      req.session.resetPasswordFailedAttempt = 0;
      return res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
