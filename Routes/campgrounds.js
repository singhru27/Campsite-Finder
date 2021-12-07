const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/WrapAsync.js");
const Campground = require("../Models/model.js");
const Review = require("../Models/review.js");
const { isLoggedIn, validateCampground, verifyOwner } = require("../Middleware/middleware.js");



router.get("/", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    return res.render("campgrounds/index.ejs", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

router.get("/:id/edit", isLoggedIn, verifyOwner, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("owner");
    res.render("campgrounds/edit.ejs", { campground, currentUser: req.user });
}));
router.get("/:id", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate("owner");
    if (!campground) {
        req.flash("error", "Campground cannot be found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
}));

router.put("/:id", isLoggedIn, verifyOwner, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground).populate("reviews").populate("owner");
    if (!campground) {
        req.flash("error", "Campground cannot be found");
        return res.redirect("/campgrounds");
    }
    req.flash('success', 'Successfully edited a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.post("/", isLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.owner = req.user;
    await newCamp.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
}));


router.delete("/:id", isLoggedIn, verifyOwner, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect(`/campgrounds`);
}));

module.exports = router;