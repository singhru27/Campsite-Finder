const Geocache = require("../Models/model.js");
const Review = require("../Models/review.js");

module.exports.createReview = async (req, res) => {
  const currGeocache = await Geocache.findById(req.params.id);
  const currReview = new Review(req.body.review);
  currReview.owner = req.user;
  currGeocache.reviews.push(currReview);
  await currGeocache.save();
  await currReview.save();
  req.flash("success", "Successfully created a new review");
  res.redirect(`/geocaches/${currGeocache._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewid } = req.params;
  await Geocache.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Successfully deleted a review");
  res.redirect(`/geocaches/${id}`);
};
