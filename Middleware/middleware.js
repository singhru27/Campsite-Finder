const { geocacheSchema, reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError.js");
const Geocache = require("../Models/model.js");
const Review = require("../Models/review.js");

const isLoggedIn = function (req, res, next) {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    if (req.query._method === "DELETE" || req.query._method === "POST") {
      req.session.returnTo = `/geocaches/${id}`;
    } else {
      req.session.returnTo = req.originalUrl;
    }
    req.flash("error", "You must log in to do this");
    res.redirect("/login");
  } else {
    return next();
  }
};

async function verifyOwner(req, res, next) {
  const currUser = req.user;
  const currGeocache = await Geocache.findById(req.params.id)
    .populate("reviews")
    .populate("owner");
  if (currGeocache.owner._id.equals(currUser._id)) {
    return next();
  } else {
    req.flash("error", "You do not have permission to do this");
    return res.redirect("/geocaches");
  }
}

async function verifyReviewOwner(req, res, next) {
  const currUser = req.user;
  const currReview = await Review.findById(req.params.reviewid).populate(
    "owner"
  );
  if (currReview.owner._id.equals(currUser._id)) {
    return next();
  } else {
    req.flash("error", "You do not have permission to do this");
    return res.redirect("/geocaches");
  }
}

function validateGeocache(req, res, next) {
  const { error } = geocacheSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
}

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.validateGeocache = validateGeocache;
module.exports.validateReview = validateReview;
module.exports.verifyOwner = verifyOwner;
module.exports.verifyReviewOwner = verifyReviewOwner;
