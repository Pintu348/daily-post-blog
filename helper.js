const hbs = require("hbs");
const Likes = require("./model/likescount");
const User = require("./model/user");
const io = require("./socket");
hbs.registerHelper("sliceDesc", (desc) => {
  if (desc.length >= 60) {
    return desc.slice(0, 50) + ".....";
  }
  return desc;
});

hbs.registerHelper("getDate", (dateTime) => {
  const currentYear = new Date().getFullYear();
  const updatedYear = dateTime.getFullYear();

  const currentMonth = new Date().getMonth();
  const updatedMonth = dateTime.getMonth();

  const currentDay = new Date().getDate();
  const updatedDay = dateTime.getDate();

  const currentHours = new Date().getHours();
  const UpdatedHours = dateTime.getHours();

  const currentMinutes = new Date().getMinutes();
  const updatedMinutes = dateTime.getMinutes();

  const currentSecond = new Date().getSeconds();
  const updatedSecond = dateTime.getSeconds();
  if (currentYear > updatedYear) {
    const year = currentYear - updatedYear;
    if (year === 1) {
      return String(year) + " year";
    }
    return String(year) + " years";
  } else if (currentMonth > updatedMonth) {
    const month = currentMonth - updatedMonth;
    if (month === 1) {
      return String(month) + " month";
    }
    return String(month) + " months";
  } else if (currentDay > updatedDay) {
    const day = currentDay - updatedDay;
    if (day === 1) {
      return String(day) + " day";
    }
    return String(day) + " days";
  } else if (currentHours > UpdatedHours) {
    const hour = currentHours - UpdatedHours;
    if (hour === 1) {
      return String(hour) + " hour";
    }
    return String(hour) + " hours";
  } else if (currentMinutes > updatedMinutes) {
    const minutes = currentMinutes - updatedMinutes;
    if (minutes === 1) {
      return String(minutes) + " min";
    }
    return String(minutes) + " mins";
  } else {
    const second = currentSecond - updatedSecond;
    if (second == 1) {
      return String(currentSecond - updatedSecond) + " sec";
    }
    return String(currentSecond - updatedSecond) + " secs";
  }
});

app.use(async (req, res, next) => {
  const likes = await Likes.findAll();
  // let j = -1;
  hbs.registerHelper("likesCount", (id) => {
    try {
      // j++;
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].dataValues.PostId == id) {
          // io.getIO().emit("postLiked", {
          //   index: j,
          //   likes: likes[i].dataValues.count,
          // });
          if (likes[i].dataValues.count == 0) {
            return null;
          }
          if(likes[i].dataValues.count == 1)
          {
            return likes[i].dataValues.count + " Like";
          }
          return likes[i].dataValues.count + " Likes";
        }
      }

      // console.log(likes[i].dataValues.count);
    } catch (err) {
      console.log(err);
    }
  });

  const user = await User.findAll();
  hbs.registerHelper("creator", (id) => {
    for (let i = 0; i < user.length; i++) {
      if (user[i].dataValues.id == id) {
        return (
          user[i].dataValues.name.charAt(0).toUpperCase() +
          user[i].dataValues.name.slice(1)
        );
      }
    }
  });
  next();
});
