const fs = require("fs");
const path = require("path");

const checkUserId = (req, res, next) => {
  console.log("midd checkUserId");
  const { userId } = req.session;

  if (!userId) {
    return res.redirect("/signin");
  }

  const usersFile = fs.readFileSync(
    path.join(__dirname, "../models/user.json")
  );
  const users = JSON.parse(usersFile);

  const existedUser = users.find((current) => current.id === userId);

  if (!existedUser) {
    return res.redirect("/signin");
  }

  req.user = existedUser;
  next();
};

const checkUserNotSigned = (req, res, next) => {
  console.log("midd checkUserNotSigned");
  const { userId } = req.session;

  if (userId) {
    return res.redirect("/");
  }

  next();
};

module.exports = { checkUserId, checkUserNotSigned };
