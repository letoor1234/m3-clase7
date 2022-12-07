const { Router } = require("express");
const {
  sendSignupForm,
  getSignupData,
  sendSigninForm,
  getSigninData,
} = require("../controllers/authControllers");

const router = Router();

router.get("/signup", sendSignupForm);

router.post("/signup", getSignupData);

router.get("/signin", sendSigninForm);

router.post("/signin", getSigninData);

module.exports = router;
