const userNormalizator = (userObj) => {
    console.log(userObj);
    const fields = [
        '_id',
        'password',
    ];

    fields.forEach((field) => {
        delete userObj[field];
    });

    return userObj;
};

module.exports = {
    userNormalizator,
};
