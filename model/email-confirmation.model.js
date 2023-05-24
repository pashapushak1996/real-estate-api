const { model, Schema } = require('mongoose');
const { dbModels } = require('../config');

const emailConfirmationSchema = new Schema({
    confirmationCode: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: dbModels.USER,
    },
    expired: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = model(dbModels.EMAIL_CONFIRMATION, emailConfirmationSchema);
