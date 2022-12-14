const crypto = require("crypto");
const userDAL = require("./data/user-dal");
const LocalStrategy = require("passport-local");
const { StatusCodes } = require("http-status-codes");

const localStrategy = new LocalStrategy(async function verify(username, password, cb) {
    const users = await userDAL.getUsers({ email: username, isEmailValidated: true, isValid: true });

    if (users.length !== 1) {
        return cb("Incorrect username or password.");
    }

    const user = users[0];

    crypto.scrypt(password, user.salt, 32, (err, hashedPassword) => {
        try {
            if (err) {
                throw new Error(err);
            }
            if (!crypto.timingSafeEqual(Buffer.from(user.hash, "hex"), hashedPassword)) {
                return cb("Incorrect username or password.");
            } else {
                return cb(null, user);
            }
        } catch (e) {
            return cb("Incorrect username or password.");
        }
    });
});


module.exports = {
    localStrategy
};