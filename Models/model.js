const mongoose = require("mongoose");
const Review = require("./review.js");

const GeocacheSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    image: [
      {
        url: String,
        key: String,
      },
    ],
    location: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

GeocacheSchema.virtual("properties.popup").get(function () {
  return `<a href=/geocaches/${this._id}> ${this.title} </a>`;
});

GeocacheSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Geocache", GeocacheSchema);
