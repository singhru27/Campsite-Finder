const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const { SESV2 } = require('aws-sdk');
const sharp = require('sharp');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_ID,
    region: 'us-east-2'
});
const fileFilter = (req, file, cb) => {
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
        shouldTransform : function (req, file, cb) {
            cb(null, /^image/i.test(file.mimetype))
        },
        transforms: [{
            id: String(Date.now()),
            key: function (req, file, cb) {
                cb(null, String(Date.now())); //use Date.now() for unique file keys
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize(1000,1000).jpeg())
            }
        }]
    }),
    fileFilter: fileFilter

});

const deleteObject = function(key) {
    s3.deleteObject({
        Bucket: 'webapp-images-campfinder',
        Key: key
    } ,(err, data) => {
    })
}

module.exports.upload = upload;
module.exports.deleteFromS3 = deleteObject;


