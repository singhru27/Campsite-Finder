const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
require('dotenv').config();
const ExpressError = require("./utils/ExpressError.js");
const campgroundsRoutes = require("./Routes/campgrounds.js");
const reviewsRoutes = require("./Routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
// Setup configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "/Views"));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(flash());



// Configuration file for the session
const sessionConfig = {
    secret: "TestSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

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

// Middleware that handles flash messages

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Router breakout for all campgrounds based pages
app.use('/campgrounds', campgroundsRoutes);
// Router breakout for all review based pages
app.use('/campgrounds/:id/reviews', reviewsRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    if (!err.status) {
        err.status = 500;
    }
    res.status(err.status).render("error.ejs", { err });
});



// Listening to port 3000
app.listen(3000, () => {
    console.log("Server is Running");
});