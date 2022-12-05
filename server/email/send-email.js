const nodemailer = require("nodemailer");

/**
 * Sends an email with the HikeTracker account
 * @param {nodemailer.SendMailOptions} mailOptions 
 * @returns {Promise<nodemailer.SentMessageInfo>} A promise that completes when the email is sent
 */
async function sendEmail(mailOptions) {
    const Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "hiketracker19@gmail.com",
            //pass: "HikeTrackerTeam19"
            pass: "pmlzruazetvvikow"
        }
    });
    return await Transport.sendMail({ ...mailOptions, sender: "hiketracker"});
};

module.exports = sendEmail;