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
                location: row.Location,
                image: "https://images.unsplash.com/photo-1485609315582-cfffa02888e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTYzNzcyNjAxOQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
                price: Math.floor(Math.random() * 100),
                description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum"
            });
            await currCampsite.save();

        })
        .on('end', function () {
            console.log("end");
        })
}

seedDatabase();