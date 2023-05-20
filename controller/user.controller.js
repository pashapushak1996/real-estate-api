const { User } = require('../model');
const { passwordService } = require('../service');
const { userNormalizator } = require('../util/user.utils');
const { statusCodes } = require('../constants');

const userController = {
    create: async (req, res, next) => {
        try {
            const { password } = req.body;

            const hashedPassword = await passwordService.hash(password);

            const userDocument = await User.create({ ...req.body, password: hashedPassword });

            const userObject = userDocument.toObject();

            const normalizedUser = userNormalizator(userObject);

            res.status(statusCodes.CREATED).json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const { loggedUser, body } = req;

            const user = await User.findByIdAndUpdate(
                loggedUser._id,
                { ...loggedUser, ...body },
                { new: true },
            );

            const normalizedUser = userNormalizator(user.toObject());

            res.json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { user } = req;

            await User.deleteOne({ _id: user._id });

            res.status(statusCodes.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    },
};

module.exports = userController;
