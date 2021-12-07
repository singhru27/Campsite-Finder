const express = require('express');
const wrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const userController = require("../Controllers/users.js")


router.route("/register")
    .get(userController.showRegistration)
    .post(wrapAsync(userController.registerUser));

router.route("/login")
    .get(userController.showLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), userController.loginUser);


router.get("/logout", userController.logout);

module.exports = router;
