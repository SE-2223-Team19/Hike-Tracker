const passport = require("passport");
const { StatusCodes } = require("http-status-codes");

/**
 * GET /session/current
 * Gets the current session's user if it exists
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function getSession(req, res) {
    if (req.isAuthenticated()) {
        return res.json(req.user);
    }
    return res.status(StatusCodes.UNAUTHORIZED).end();
}

/**
 * POST /session
 * Creates a new session (log the user in)
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function createSession(req, res) {
    try {
        const user = await (new Promise((resolve, reject) => {
            passport.authenticate("local", (err, user) => {
                if (err) {
                    return reject(err);
                }
                req.login({
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    userType: user.userType
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            })(req, res);
        }));
        return res.status(StatusCodes.CREATED).json(user);
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ err: err.message });
    }
}

/**
 * DELETE /session/current
 * Deletes the current session (logs the user out)
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<void>}
 */
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