const sendHomeView = (req, res) => {
  console.log("get /");
  res.render("dashboard.ejs", { user: req.user });
};

module.exports = { sendHomeView };
