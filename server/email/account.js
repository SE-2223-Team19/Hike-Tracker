const sendEmail = require("./send-email");

/**
 * Sends the verification request email
 * @param {String} email 
 * @param {String} uniqueString 
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(email, uniqueString) {
    const mailOptions = {
        to: email,
        subject: "Hike Tracker Account Verification",
        html: `<p>Thank you for registering with Hike Tracker. Please click the link below to verify your account.</p>
        <p><a href="http://localhost:3000/verify/${uniqueString}">Verify Account</a></p> <p>Thank you!</p>`
    };
    return sendEmail(mailOptions);
}

/**
 * Sends a email to notify the user that their account has been blocked
 * @param {String} email 
 * @param {String} blockedBy 
 * @returns {Promise<void>}
 */
async function sendAccountBlockedEmail(email, blockedBy) {
    const mailOptions = {
        to: email,
        subject: "Hike Tracker Account Blocked",
        html: `<p>Your account has been blocked by ${blockedBy}</p>`
    };
    return sendEmail(mailOptions);
}

/**
 * Sends a email to notify the user that their account has been validated
 * @param {String} email 
 * @param {String} activatedBy 
 * @returns {Promise<void>}
 */
async function sendAccountValidatedEmail(email, activatedBy) {
    const mailOptions = {
        to: email,
        subject: "Hike Tracker Account Validated",
        html: `<p>Your account has been activated by ${activatedBy}</p>`
    };
    return sendEmail(mailOptions);
}

module.exports = {
    sendVerificationEmail,
    sendAccountBlockedEmail,
    sendAccountValidatedEmail
};