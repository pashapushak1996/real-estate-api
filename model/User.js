const { Schema, model } = require('mongoose');

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

userSchema.set('toJSON', { virtuals: true });

module.exports = model('User', userSchema);
