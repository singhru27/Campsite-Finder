const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/WrapAsync.js");
const Campground = require("../Models/model.js");
const Review = require("../Models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("../schemas.js");

function validateCampground(req, res, next) {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get("/", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

router.get("/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
}));
router.get("/:id", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show.ejs", { campground });
}));

router.put("/:id", validateCampground, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.post("/", validateCampground, wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect("/campgrounds");
}));


router.delete("/:id", wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
}));

module.exports = router;