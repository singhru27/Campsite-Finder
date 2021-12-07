const express = require('express');
const router = express.Router();
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/WrapAsync.js");
const campgroundController = require('../Controllers/Campgrounds.js');
const { isLoggedIn, validateCampground, verifyOwner } = require("../Middleware/middleware.js");



router.get("/", wrapAsync(campgroundController.index));
router.get("/new", isLoggedIn, campgroundController.showNewForm);
router.get("/:id/edit", isLoggedIn, verifyOwner, wrapAsync(campgroundController.showEditForm));
router.get("/:id", wrapAsync(campgroundController.showCampground));
router.put("/:id", isLoggedIn, verifyOwner, wrapAsync(campgroundController.editCampground));
router.post("/", isLoggedIn, validateCampground, wrapAsync(campgroundController.createCampground));
router.delete("/:id", isLoggedIn, verifyOwner, wrapAsync(campgroundController.deleteCampground));
module.exports = router;