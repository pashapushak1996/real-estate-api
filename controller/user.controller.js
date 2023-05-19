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

    update: (req, res, next) => {
        try {

        } catch (e) {
            next(e);
        }
    },

    delete: (req, res, next) => {
        try {

        } catch (e) {
            next(e);
        }
    },
};

module.exports = userController;
