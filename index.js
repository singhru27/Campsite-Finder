const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
require('dotenv').config();
const Campground = require("./Models/model.js");
const Review = require("./Models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas.js");


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
});

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

function validateCampground(req, res, next) {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

function validateReview(req, res, next) {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

};

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/campgrounds", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id/edit", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
}));
app.get("/campgrounds/:id", wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show.ejs", { campground });
}));



app.put("/campgrounds/:id", validateCampground, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.post("/campgrounds", validateCampground, wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const currCampground = await Campground.findById(req.params.id);
    const currReview = new Review(req.body.review);
    currCampground.reviews.push(currReview);
    await currCampground.save();
    await currReview.save();
    res.redirect(`/campgrounds/${currCampground._id}`);
}));

app.delete("/campgrounds/:id", wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
}));

app.delete("/campgrounds/:id/reviews/:reviewid", wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/campgrounds/${id}`);

}));

app.all("*", (req, res, next) => {
    throw new ExpressError("Page Not Found", 404);
});

app.use((err, req, res, next) => {
    if (!err.status) {
        err.status = 500;
    }
    console.log(err.message);
    res.status(err.status).render("error.ejs", err);
});


