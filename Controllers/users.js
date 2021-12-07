const User = require("../Models/user.js");


module.exports.showRegistration = (req, res) => {
    res.render('users/register.ejs');
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username: username, email: email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next();
            }
        });
        req.flash('success', "Welcome to CampFinder!");
        res.redirect("/campgrounds");
    } catch (e) {
        req.flash('error', e.message);
        res.redirect("/register");
    }
};

module.exports.showLogin = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.loginUser = (req, res) => {
    req.flash("success", "Succesfully logged in");
    let redirectionUrl = "/campgrounds";
    if (req.session.returnTo) {
        redirectionUrl = req.session.returnTo;
        delete req.session.returnTo;
    }
    return res.redirect(redirectionUrl);

};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged out");
    res.redirect("/campgrounds");
};