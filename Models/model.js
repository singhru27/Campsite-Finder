const mongoose = require('mongoose');
const Review = require("./review.js");

const CampgroundSchema = mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})

CampgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }

})
module.exports = mongoose.model("Campground", CampgroundSchema);