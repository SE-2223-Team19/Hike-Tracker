const crypto = require("crypto");
const userDAL = require("./data/user-dal");
const LocalStrategy = require("passport-local");
const { StatusCodes } = require("http-status-codes");

const localStrategy = new LocalStrategy(async function verify(username, password, cb) {
    const users = await userDAL.getUsers({ email: username });

    if (users.length !== 1) {
        return cb(null, false, "Incorrect username or password.");
    }

    const user = users[0];

    const hash = crypto.scryptSync(value.password, user.salt, 32);

    if (crypto.timingSafeEqual(Buffer.from(user.hash, "hex"), hash)) {
        return res.status(StatusCodes.OK);
    }

    crypto.scrypt(password, user.salt, 32, (err, hashedPassword) => {
        try {
            if (err) {
                throw new Error(err);
            }
            if (!crypto.timingSafeEqual(Buffer.from(user.hash, "hex"), hashedPassword)) {
                return cb(null, false, "Incorrect username or password.");
            } else {
                return cb(null, user);
            }
        } catch (e) {
            return cb(null, false, "Incorrect username or password.");
        }
    });
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(StatusCodes.UNAUTHORIZED).end();
};

module.exports = {
    localStrategy,
    isLoggedIn
};