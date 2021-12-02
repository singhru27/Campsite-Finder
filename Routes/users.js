const express = require('express');
const wrapAsync = require("../utils/WrapAsync.js");
const User = require("../Models/user.js");

const router = express.Router({ mergeParams: true });


router.get("/register", (req, res) => {
    res.render('users/register');
})
