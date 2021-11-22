const mongoose = require('mongoose');
const Campground = require("../Models/model.js");
require('dotenv').config();
const availableCities = require("./cities.js");
const fs = require('fs')
const csv = require('csv-parser')


// Connection to the Mongo database
const password = process.env.MONGO_PASSWORD;
mongoose.connect(`mongodb+srv://singhru:${password}@rsdb.bodim.mongodb.net/Campsites?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Connection Accepted");
    })
    .catch(() => {
        console.log("Connection Refused");
    });


seedDatabase = async function () {
    // Deletes all Campgrounds from the database
    await Campground.deleteMany({});
    seedLocation('./Data/MidwestCamp.csv');
    seedLocation('./Data/NortheastCamp.csv');
    seedLocation('./Data/SouthCamp.csv');
    seedLocation('./Data/SouthwestCamp.csv');
    seedLocation('./Data/WestCamp.csv');
    console.log("Completed");

}

function seedLocation(location) {
    fs.createReadStream(location)
        .pipe(csv())
        .on('data', async function (row) {
            currCampsite = new Campground({
                title: row.Name,
                location: row.Location
            });
            await currCampsite.save();

        })
        .on('end', function () {
            console.log("end");
        })
}

seedDatabase();