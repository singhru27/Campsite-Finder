const Campground = require("../Models/model.js");
const Review = require("../Models/review.js");

module.exports.createReview = async (req, res) => {
    const currCampground = await Campground.findById(req.params.id);
    const currReview = new Review(req.body.review);
    currReview.owner = req.user;
    currCampground.reviews.push(currReview);
    await currCampground.save();
    await currReview.save();
    req.flash('success', 'Successfully created a new review');
    res.redirect(`/campgrounds/${currCampground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
};