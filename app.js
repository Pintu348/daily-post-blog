require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const path = require("path");

const hbs = require("hbs");

const Sequelize = require("sequelize");

const mongoose = require("mongoose");

const sequelize = require("./util/database");

const User = require("./model/user");
const Post = require("./model/post");

const favoritePost = require("./model/favoritepost");
const LikedPost = require("./model/likedpost");

const Likes = require("./model/likescount");

const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);

const flash = require("connect-flash");

const multer = require("multer");

app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  session({
    secret: "myusefulsecret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 300 },
  })
);

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const errorController = require("./controller/error");

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public", "js")));

// this is registering partials folder for code reuability
hbs.registerPartials(__dirname + "/views/include", function (err) { });

hbs.registerHelper("ternary", require("handlebars-helper-ternary"));

const helper = require("./helper");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueName + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/avif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(flash());
// handling user routes
app.use(userRoutes);
// handling sign up and login routes
app.use(authRoutes);
// showing error page to the client while typing wrong url

app.use(errorController.Page404);

// association method
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User);

User.hasMany(favoritePost, { onDelete: "CASCADE" });
Post.hasMany(favoritePost, { onDelete: "CASCADE" });
favoritePost.belongsTo(User);
favoritePost.belongsTo(Post);

User.hasMany(LikedPost, { onDelete: "CASCADE" });
Post.hasMany(LikedPost, { onDelete: "CASCADE" });
LikedPost.belongsTo(User);
LikedPost.belongsTo(Post);

Post.hasMany(Likes, { onDelete: "CASCADE" });
Likes.belongsTo(Post);

const dbConnection = async () => {
  try {
    // await sequelize.sync({force:true});
    await sequelize.sync();
    console.log("Connection sql has been established successfully.");
    await mongoose.connect(MONGODB_URI);
    console.log("mongodb");
    const server = app.listen(process.env.PORT, () => {
      console.log("PORT NO - ", process.env.PORT);
    });
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client connected:", socket.id);
      // socket.emit("postCreated","pintu pandit created this post");
    });
  } catch (error) {
    console.error("Unable to connect to the database:\n", error);
  }
};
dbConnection();
