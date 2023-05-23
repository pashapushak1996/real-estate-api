const regExps = {
    PASSWORD: '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$',
    EMAIL: '^\\S+@\\S+\\.\\S+$',
};

module.exports = regExps;
