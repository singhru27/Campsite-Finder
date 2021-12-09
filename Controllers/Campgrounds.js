const Campground = require("../Models/model.js");
const Review = require("../Models/review.js");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    return res.render("campgrounds/index.ejs", { campgrounds });
}

module.exports.showNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
}

module.exports.showEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("owner");
    res.render("campgrounds/edit.ejs", { campground, currentUser: req.user });
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate("owner");
    if (!campground) {
        req.flash("error", "Campground cannot be found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
}

module.exports.editCampground = async (req, res) => {
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground).populate("reviews").populate("owner");
    const images = req.files.map(f => ({ url: f.location, key: f.key }));
    campground.image.push(...images);
    await campground.save();
    if (!campground) {
        req.flash("error", "Campground cannot be found");
        return res.redirect("/campgrounds");
    }
    req.flash('success', 'Successfully edited a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.createCampground = async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.image = req.files.map(f => ({ url: f.location, key: f.key }));
    newCamp.owner = req.user;
    await newCamp.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect(`/campgrounds`);
}