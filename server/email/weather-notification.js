const sendEmail = require("./send-email");

/**
 * Sends a email to notify the user that their account has been blocked
 * @param {String} email 
 * @param {String} geoCoordinates
 * @param {string} geoRadius
 * @param {string} weatherState 
 * @returns {Promise<void>}
 */
 async function sendWeatherNotificationEmail(email, geoCoordinates,geoRadius,weatherState) {
    const mailOptions = {
        to: email,
        subject: "Weather news updates",
        html: `<p> This area is reported with this condition:<p style="color:red;">geoCoordinates:${geoCoordinates}</p>
        <p style="color:blue;"> geoRadius:${geoRadius},</p><p style="color:green;"> weatherState=${weatherState}</p> </p>`
    };
    return sendEmail(mailOptions);
}
module.exports.sendWeatherNotificationEmail = sendWeatherNotificationEmail