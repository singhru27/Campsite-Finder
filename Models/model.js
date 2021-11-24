const mongoose = require('mongoose');

const CampgroundSchema = mongoose.Schema({
    title: String,
    price: String,
    description: String,
    image: String,
    location: String
})

module.exports = mongoose.model("Campground", CampgroundSchema);