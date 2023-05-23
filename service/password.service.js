const bcrypt = require('bcrypt');

const { ErrorHandler } = require('../error');

const passwordService = {
    hash: (password) => bcrypt.hash(password, 10),
    compare: async (password, hashedPassword) => {
        const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordMatched) {
            throw new ErrorHandler(400, 'Email or password is wrong');
        }
    },
};

module.exports = passwordService;
