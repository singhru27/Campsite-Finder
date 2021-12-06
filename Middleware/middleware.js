const { campgroundSchema, reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError.js");


const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must log in to visit this page");
        res.redirect("/login");
    } else {
        return next();
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