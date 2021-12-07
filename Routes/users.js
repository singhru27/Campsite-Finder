const express = require('express');
const wrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const userController = require("../Controllers/users.js")


router.get("/register", userController.showRegistration);

router.post("/register", wrapAsync(userController.registerUser));

router.get("/login", userController.showLogin);

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), userController.loginUser);

router.get("/logout", userController.logout);

module.exports = router;
