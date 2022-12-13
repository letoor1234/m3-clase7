const { Router } = require("express");
const { sendHomeView } = require("../controllers/homeControllers");
const { checkUserId } = require("../middlewares/checkUserId");

const router = Router();

router.get("/", [checkUserId], sendHomeView);

module.exports = router;
