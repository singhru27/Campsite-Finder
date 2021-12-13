const Geocache = require("../Models/model.js");
const Review = require("../Models/review.js");
const { deleteFromS3 } = require("../AWS/S3.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocoding({
  accessToken: process.env.MAPBOX_TOKEN,
});

module.exports.index = async (req, res) => {
  const geocaches = await Geocache.find({});
  return res.render("geocaches/index.ejs", { geocaches });
};

module.exports.showNewForm = (req, res) => {
  res.render("geocaches/new.ejs");
};

module.exports.showEditForm = async (req, res) => {
  const geocache = await Geocache.findById(req.params.id)
    .populate("reviews")
    .populate("owner");
  res.render("geocaches/edit.ejs", { geocache, currentUser: req.user });
};

module.exports.showGeocache = async (req, res) => {
  const geocache = await Geocache.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
      },
    })
    .populate("owner");
  if (!geocache) {
    req.flash("error", "Geocache cannot be found");
    return res.redirect("/geocaches");
  }
  res.render("geocaches/show.ejs", { geocache });
};

module.exports.editGeocache = async (req, res) => {
  const geocache = await Geocache.findByIdAndUpdate(
    req.params.id,
    req.body.geocache
  )
    .populate("reviews")
    .populate("owner");
  const images = req.files.map((f) => ({
    url: f.transforms[0].location,
    key: f.transforms[0].key,
  }));
  geocache.image.push(...images);
  if (req.body.deleteImages) {
    await geocache.updateOne({
      $pull: { image: { key: { $in: req.body.deleteImages } } },
    });
    for (let currImage of req.body.deleteImages) {
      deleteFromS3(currImage);
    }
  }

  await geocache.save();
  if (!geocache) {
    req.flash("error", "Geocache cannot be found");
    return res.redirect("/geocaches");
  }
  req.flash("success", "Successfully edited a Geocache");
  res.redirect(`/geocaches/${geocache._id}`);
};

module.exports.createGeocache = async (req, res, next) => {
  results = {
    type: "Point",
    coordinates: [
      Number(req.body.geocache.longitude),
      Number(req.body.geocache.latitude),
    ],
  };
  const newGeocache = new Geocache(req.body.geocache);
  newGeocache.geometry = results;
  newGeocache.image = req.files.map((f) => ({
    url: f.transforms[0].location,
    key: f.transforms[0].key,
  }));
  newGeocache.owner = req.user;
  await newGeocache.save();
  req.flash("success", "Successfully created a new Geocache");
  res.redirect(`/geocaches/${newGeocache._id}`);
};

module.exports.deleteGeocache = async (req, res) => {
  const geocache = await Geocache.findByIdAndDelete(req.params.id);
  const images = geocache.image;

  if (images) {
    for (let currImage of images) {
      deleteFromS3(currImage.key);
    }
  }

  req.flash("success", "Successfully deleted a Geocache");
  res.redirect(`/geocaches`);
};
