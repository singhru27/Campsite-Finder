const Joi = require("joi");
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().required(),
            key: Joi.string().required()
        }),
        location: Joi.string().required(),


    }).required(),
    deleteImages: Joi.array().items(Joi.string())

})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})