const passport = require("passport");
const { StatusCodes } = require("http-status-codes");

async function getSession(req, res) {
    if (req.isAuthenticated()) {
		return res.json(req.user);
	}
    return res.status(StatusCodes.UNAUTHORIZED);
}

async function createSession(req, res) {
    try {
        const user = await (new Promise((resolve, reject) => {
            passport.authenticate("local", (...args) => {
                resolve(req.user);
            });
        }));
        return res.status(StatusCodes.CREATED).json(user);
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ err: err.message });
    }
}

async function deleteSession(req, res) {
    req.logout(() => {
        res.status(StatusCodes.OK).end();
    });
}

module.exports = {
    getSession,
    createSession,
    deleteSession
};