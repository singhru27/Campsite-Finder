const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must log in to visit this page");
        res.redirect("/login");
    } else {
        return next();
    }
}

module.exports.isLoggedIn = isLoggedIn;