const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
require('dotenv').config();
const Campground = require("./Models/model.js");


// Setup configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "/Views"));
app.use(methodOverride('_method'));

// Listening to port 3000
app.listen(3000, () => {
    console.log("Server is Running");
})

// Connection to the Mongo database
const password = process.env.MONGO_PASSWORD;
mongoose.connect(`mongodb+srv://singhru:${password}@rsdb.bodim.mongodb.net/Campsites?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Connection Accepted");
    })
    .catch((e) => {
        console.log(e);
        console.log("Connection Refused");
    });

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
})

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
})
app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show.ejs", { campground });
})

app.put("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);


});

app.post("/campgrounds", wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect("/campgrounds");
    next(e);
}))

app.delete("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
})

app.use((err, req, res, next) => {
    res.send("An error has occured");
})


