const { Schema, model } = require('mongoose');

const { dbModels } = require('../constants');

const oauthSchema = new Schema({
    access_token: {
        type: String,
        required: true,
    },
    refresh: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: dbModels.USER,
    },
});

module.exports = model(dbModels.OAUTH, oauthSchema);
