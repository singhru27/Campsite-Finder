const express = require("express");
const router = express.Router();
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/WrapAsync.js");
const geocacheController = require("../Controllers/geocaches.js");
const {
  isLoggedIn,
  validateGeocache,
  verifyOwner,
} = require("../Middleware/middleware.js");
const { upload } = require("../AWS/S3.js");

router
  .route("/")
  .get(wrapAsync(geocacheController.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateGeocache,
    wrapAsync(geocacheController.createGeocache)
  );

router.get("/new", isLoggedIn, geocacheController.showNewForm);

router
  .route("/:id")
  .get(wrapAsync(geocacheController.showGeocache))
  .put(
    isLoggedIn,
    verifyOwner,
    upload.array("image"),
    validateGeocache,
    wrapAsync(geocacheController.editGeocache)
  )
  .delete(
    isLoggedIn,
    verifyOwner,
    wrapAsync(geocacheController.deleteGeocache)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  verifyOwner,
  wrapAsync(geocacheController.showEditForm)
);

module.exports = router;
