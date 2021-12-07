const express = require('express');
const wrapAsync = require("../utils/WrapAsync.js");
const Campground = require("../Models/model.js");
const Review = require("../Models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("../schemas.js");
const { validateReview, isLoggedIn, verifyReviewOwner } = require("../Middleware/middleware.js");




const router = express.Router({ mergeParams: true });


router.post("/", validateReview, isLoggedIn, wrapAsync(async (req, res) => {
    const currCampground = await Campground.findById(req.params.id);
    const currReview = new Review(req.body.review);
    currReview.owner = req.user;
    currCampground.reviews.push(currReview);
    await currCampground.save();
    await currReview.save();
    req.flash('success', 'Successfully created a new review');
    res.redirect(`/campgrounds/${currCampground._id}`);
}));

router.delete("/:reviewid", isLoggedIn, verifyReviewOwner, wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;