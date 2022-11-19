const nodemailer = require("nodemailer");

const sendEmail = (email, uniqueString) => {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "hiketracker19@gmail.com",
            //pass: "HikeTrackerTeam19"
            pass: "pmlzruazetvvikow"
        }
    });
    var mailOptions;
    let sender = "hiketracker";
    mailOptions = {
        from: sender,
        to: email,
        subject: "Hike Tracker Account Verification",
        html: `<p>Thank you for registering with Hike Tracker. Please click the link below to verify your account.</p>
        <p><a href="http://localhost:3000/verify/${uniqueString}">Verify Account</a></p> <p>Thank you!</p>`
    };
    Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
}

module.exports = {
    sendEmail
};