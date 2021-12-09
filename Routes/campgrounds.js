const express = require('express');
const router = express.Router();
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/WrapAsync.js");
const campgroundController = require('../Controllers/campgrounds.js');
const { isLoggedIn, validateCampground, verifyOwner } = require("../Middleware/middleware.js");
const { upload } = require("../AWS/S3.js");

router.route("/")
    .get(wrapAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgroundController.createCampground));

router.get("/new", isLoggedIn, campgroundController.showNewForm);

router.route("/:id")
    .get(wrapAsync(campgroundController.showCampground))
    .put(isLoggedIn, verifyOwner, upload.array('image'), validateCampground, wrapAsync(campgroundController.editCampground))
    .delete(isLoggedIn, verifyOwner, wrapAsync(campgroundController.deleteCampground))

router.get("/:id/edit", isLoggedIn, verifyOwner, wrapAsync(campgroundController.showEditForm));

module.exports = router;