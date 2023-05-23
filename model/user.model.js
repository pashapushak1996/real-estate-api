const { Schema, model } = require('mongoose');

const { dbModels, userStatuses } = require('../config');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        enum: [...Object.values(userStatuses)],
        required: true,
        default: userStatuses.PENDING,
    },
    confirmationCode: {
        type: String,
        required: true,
        selected: false,
    },
    password: { type: String, required: true },
    image: String,
}, { timestamps: true });

module.exports = model(dbModels.USER, userSchema);
