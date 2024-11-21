const router = require("express").Router();
const controller = require("../controller/controller");

router.get("/total-sales", controller.report);

router.get("/login", controller.addUser);

module.exports = router;
