const { User } = require('../model');
const { passwordService } = require('../service');
const { userNormalizator } = require('../util/user.utils');

const userController = {
    create: async (req, res, next) => {
        try {
            const { password } = req.body;

            const hashedPassword = await passwordService.hash(password);

            const user = await User.create({ ...req.body, password: hashedPassword });

            const userObject = user.toJSON();

            const normalizedUser = userNormalizator(userObject);

            console.log(normalizedUser);
            res.status(201).json(normalizedUser);
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
