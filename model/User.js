const { Schema, model } = require('mongoose');

const { dbModels } = require('../constants');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    password: { type: String, required: true },
    image: String,
}, { timestamps: true });

module.exports = model(dbModels.USER, userSchema);
