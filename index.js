const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require('mongoose');
require('dotenv').config();
const Campground = require("./Models/model.js");


// Setup configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/Views"));
app.use(methodOverride('_method'));

// Connection to the Mongo database
const password = process.env.MONGO_PASSWORD;
mongoose.connect(`mongodb+srv://singhru:${password}@rsdb.bodim.mongodb.net/Campsites?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Connection Accepted");
    })
    .catch(() => {
        console.log("Connection Refused");
    });

app.get("/campground", async (req, res) => {
    const newCamp = new Campground({
        title: "Test"
    })
    await newCamp.save();
    console.log("Completed");

})


app.listen(3000, () => {
    console.log("Server is Running");
})

app.get("/", (req, res) => {
    res.render("home.ejs");
})