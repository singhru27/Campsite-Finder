const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_ID,
    region: 'us-east-2'
});
const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'webapp-images-campfinder',
        key: function (req, file, cb) {
            cb(null, Date.now()); //use Date.now() for unique file keys
        }
    }),
    fileFilter: fileFilter

});

module.exports.upload = upload;


