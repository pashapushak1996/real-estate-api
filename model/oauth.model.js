const { Schema, model } = require('mongoose');

const { dbModels } = require('../config');

const oauthSchema = new Schema({
    access_token: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: dbModels.USER,
    },
});

module.exports = model(dbModels.OAUTH, oauthSchema);
