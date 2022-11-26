const nodemailer = require("nodemailer");

/**
 * Sends the verification mail
 * @param {String} email 
 * @param {String} uniqueString 
 * @returns {Promise<void>} A primise that completes when the mail is sent
 */
const sendEmail = (email, uniqueString) => {
    const Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "hiketracker19@gmail.com",
            //pass: "HikeTrackerTeam19"
            pass: "pmlzruazetvvikow"
        }
    });
    const sender = "hiketracker";
    const mailOptions = {
        from: sender,
        to: email,
        subject: "Hike Tracker Account Verification",
        html: `<p>Thank you for registering with Hike Tracker. Please click the link below to verify your account.</p>
        <p><a href="http://localhost:3000/verify/${uniqueString}">Verify Account</a></p> <p>Thank you!</p>`
    };
    return Transport.sendMail(mailOptions)
    .then(response => {
        console.log("Message sent: " + response);
    })
    .catch(error => {
        console.error(error);
    });
}

module.exports = {
    sendEmail
};