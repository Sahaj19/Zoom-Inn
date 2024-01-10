const Joi = require("joi");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().trim().min(10).max(50).messages({
      "string.base": "Title should be a string",
      "string.empty": "Title is required",
      "string.min": "Title should atleast have {#limit} characters",
      "string.max": "Title should not exceed {#limit} characters",
      "any.required": "Title is required",
    }),

    description: Joi.string().required().trim().min(50).messages({
      "string.base": "Description should be a string",
      "string.empty": "Description is required",
      "string.min": "Description should atleast have {#limit} characters",
      "any.required": "Description is required",
    }),

    image: Joi.string().allow("", null),

    price: Joi.number().required().min(100).max(9999999999).messages({
      "number.base": "Price should be a number",
      "number.empty": "Price is required",
      "number.min": "Price should have a minimum of 3 digits",
      "number.max": "Price should not exceed 10 digits",
      "any.required": "Price is required",
    }),

    location: Joi.string().required().trim().max(50).messages({
      "string.base": "Location should be a string",
      "string.empty": "Location is required",
      "string.max": "Location should not exceed {#limit} characters",
      "any.required": "Location is required",
    }),

    country: Joi.string().required().trim().max(50).messages({
      "string.base": "Country should be a string",
      "string.empty": "Country is required",
      "string.max": "Country should not exceed {#limit} characters",
      "any.required": "Country is required",
    }),
  }).required(),
}).required();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number",
      "number.empty": "Rating is required",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
      "any.required": "Rating is required",
    }),

    comment: Joi.string().required().trim().min(4).messages({
      "string.base": "Comment must be a string",
      "string.empty": "Comment is required",
      "string.min": "comment should have a minimum of 4 characters",
      "any.required": "Comment is required",
    }),
  }).required(),
}).required();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = { listingSchema, reviewSchema };
