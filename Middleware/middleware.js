const { campgroundSchema, reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError.js");
const Campground = require("../Models/model.js");


const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must log in to do this");
        res.redirect("/login");
    } else {
        return next();
    }
}

async function verifyOwner(req, res, next) {
    const currUser = req.user;
    const currCampground = await Campground.findById(req.params.id).populate("reviews").populate("owner");
    if (currCampground.owner._id.equals(currUser._id)) {
        return next();
    } else {
        req.flash("error", "You do not have permission to do this");
        return res.redirect("/campgrounds");
    }
}


function validateCampground(req, res, next) {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        return next();
    }
};

function validateReview(req, res, next) {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

};

module.exports.isLoggedIn = isLoggedIn;
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;
module.exports.verifyOwner = verifyOwner;