const { Schema, model } = require('mongoose');
const { dbModels } = require('../config');

const forgotPasswordSchema = new Schema({
    action_token: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: dbModels.USER,
    },
});

module.exports = model(dbModels.FORGOT_PASSWORD, forgotPasswordSchema);
