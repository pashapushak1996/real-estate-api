const Joi = require('joi');

const { regExps } = require('../constants');

const createUser = Joi.object({
    name: Joi.string().alphanum().min(2).max(30).required(),
    email: Joi.string().pattern(new RegExp(regExps.EMAIL)).required(),
    password: Joi.string().pattern(new RegExp(regExps.PASSWORD)).required(),
    image: Joi.string(),
});

const updateUser = Joi.object({
    name: Joi.string().alphanum().min(2).max(30),
    email: Joi.string(),
    image: Joi.string(),
});

module.exports = {
    createUser,
    updateUser,
};
