const bcrypt = require("bcryptjs");

//hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

//compare password
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};