const userNormalizator = (userObj) => {
    const fields = [
        '__v',
        'password',
        'createdAt',
        'updatedAt',
    ];

    fields.forEach((field) => {
        delete userObj[field];
    });

    return userObj;
};

module.exports = {
    userNormalizator,
};
