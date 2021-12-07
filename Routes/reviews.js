const express = require('express');
const wrapAsync = require("../utils/WrapAsync.js");
const { validateReview, isLoggedIn, verifyReviewOwner } = require("../Middleware/middleware.js");
const reviewController = require("../Controllers/reviews.js");




const router = express.Router({ mergeParams: true });
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));
router.delete("/:reviewid", isLoggedIn, verifyReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;