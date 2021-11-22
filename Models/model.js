const mongoose = require('mongoose');

const CampgroundSchema = mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model("Campground", CampgroundSchema);