const mongoose = require('mongoose');

const CampgroundSchema = mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})

module.exports = mongoose.model("Campground", CampgroundSchema);