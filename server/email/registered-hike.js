const sendEmail = require("./send-email");
const userDAL = require("../data/user-dal");

async function sendRegisteredHikeTerminatedEmail(registeredHike) {
    const buddieEmails = await Promise.all(
        registeredHike.buddyUsers
        .map(buddy => userDAL.getUserById(buddy)
                        .then(b => b.email)
        )
    );
    sendEmail({
        to: buddieEmails,
        subject: `[${registeredHike.hike.title}] Registered hike terminated`,
        html: `<p>The hike '${registeredHike.hike.title}' you were following was terminated by the user ${registeredHike.user.fullName} at ${registeredHike.endTime.toString()}`
    })
}

module.exports = {
    sendRegisteredHikeTerminatedEmail,
};