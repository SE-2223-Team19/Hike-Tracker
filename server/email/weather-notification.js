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
        html: `<p> Your area is reported with new weather updates:
        <p style="color:green;"> weatherState=${weatherState}</p>
        <p> More information:
        <p style="color:blue;">geoCoordinates:${geoCoordinates}</p>
        <p style="color:blue;"> geoRadius:${geoRadius},</p>
         </p>`
    };
    return sendEmail(mailOptions);
}
module.exports.sendWeatherNotificationEmail = sendWeatherNotificationEmail